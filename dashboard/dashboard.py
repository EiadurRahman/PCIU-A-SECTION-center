import os
import io
import math
import streamlit as st
import boto3
from dotenv import load_dotenv

# -------------------------------------------------------------------
# Backend Client (Wrapper around your provided class)
# -------------------------------------------------------------------

class Blackblaze:
    def __init__(self, bucket_name=None):
        load_dotenv()
        self.ENDPOINT = os.getenv("B2_ENDPOINT", "https://s3.us-east-005.backblazeb2.com")
        self.client = boto3.client("s3", endpoint_url=self.ENDPOINT)
        self.BUCKET_NAME = bucket_name

    def _bucket_name(self, bucket_name=None):
        bucket_name = bucket_name or self.BUCKET_NAME
        if not bucket_name:
            raise ValueError("bucket_name must be provided")
        return bucket_name

    def list_buckets(self):
        response = self.client.list_buckets()
        return [b["Name"] for b in response.get("Buckets", [])]

    def list_objects_detailed(self, prefix="", bucket_name=None):
        """Returns object details (Key, Size, LastModified) for dashboard display."""
        bucket_name = self._bucket_name(bucket_name)
        objects = []
        paginator = self.client.get_paginator("list_objects_v2")
        for page in paginator.paginate(Bucket=bucket_name, Prefix=prefix):
            for obj in page.get("Contents", []):
                objects.append({
                    "Key": obj["Key"],
                    "Size": obj["Size"],
                    "LastModified": obj["LastModified"]
                })
        return objects

    def upload_fileobj(self, file_obj, object_name, bucket_name=None):
        bucket_name = self._bucket_name(bucket_name)
        self.client.upload_fileobj(file_obj, bucket_name, object_name)

    def download_file_bytes(self, object_name, bucket_name=None):
        bucket_name = self._bucket_name(bucket_name)
        buffer = io.BytesIO()
        self.client.download_fileobj(bucket_name, object_name, buffer)
        buffer.seek(0)
        return buffer

    def delete_file(self, object_name, bucket_name=None):
        bucket_name = self._bucket_name(bucket_name)
        self.client.delete_object(Bucket=bucket_name, Key=object_name)

    def delete_directory(self, prefix, bucket_name=None):
        bucket_name = self._bucket_name(bucket_name)
        prefix = prefix.rstrip("/") + "/"
        paginator = self.client.get_paginator("list_objects_v2")
        
        keys_to_delete = []
        for page in paginator.paginate(Bucket=bucket_name, Prefix=prefix):
            keys_to_delete.extend([{"Key": obj["Key"]} for obj in page.get("Contents", [])])

        if not keys_to_delete:
            return 0

        for i in range(0, len(keys_to_delete), 1000):
            batch = keys_to_delete[i:i + 1000]
            self.client.delete_objects(Bucket=bucket_name, Delete={"Objects": batch})
            
        return len(keys_to_delete)


# Helper: Format Bytes to Human Readable Form
def format_size(size_bytes):
    if size_bytes == 0:
        return "0 B"
    size_name = ("B", "KB", "MB", "GB", "TB")
    i = int(math.floor(math.log(size_bytes, 1024)))
    p = math.pow(1024, i)
    s = round(size_bytes / p, 2)
    return f"{s} {size_name[i]}"


# -------------------------------------------------------------------
# Streamlit Web App Interface
# -------------------------------------------------------------------

st.set_page_config(page_title="Backblaze B2 Manager", page_icon="☁️", layout="wide")

# Sidebar Configuration
st.sidebar.title("☁️ B2 Configuration")

default_bucket = "pciu-bba-37"
bucket_input = st.sidebar.text_input("Active Bucket Name", value=default_bucket)

# Initialize Session & Client
try:
    bb = Blackblaze(bucket_name=bucket_input)
except Exception as e:
    st.error(f"Failed to initialize B2 client. Check your credentials in `.env`. Error: {e}")
    st.stop()

# App Header
st.title("Backblaze B2 Storage Dashboard")
st.caption(f"Connected to bucket: `{bucket_input}`")

# Main Navigation Tabs
tab_browse, tab_upload, tab_manage = st.tabs(["📁 Browse & File Explorer", "📤 Upload Files", "🗑️ Batch & Directory Management"])

# -------------------------------------------------------------------
# TAB 1: Browse Files & Folders
# -------------------------------------------------------------------
with tab_browse:
    col_search, col_refresh = st.columns([4, 1])
    search_prefix = col_search.text_input("Filter by Prefix/Folder", value="", placeholder="e.g. Introduction to business/")
    
    if col_refresh.button("🔄 Refresh List", use_container_width=True):
        st.rerun()

    with st.spinner("Fetching objects..."):
        try:
            objects = bb.list_objects_detailed(prefix=search_prefix)
        except Exception as e:
            st.error(f"Error fetching objects: {e}")
            objects = []

    if not objects:
        st.info("No files found matching the criteria.")
    else:
        # Overview Metrics
        total_size = sum(obj["Size"] for obj in objects)
        col1, col2 = st.columns(2)
        col1.metric("Total Objects Shown", len(objects))
        col2.metric("Total Size", format_size(total_size))

        st.markdown("---")

        # Object Table & Actions
        for obj in objects:
            c_name, c_size, c_date, c_dl, c_del = st.columns([4, 2, 2, 1, 1])
            
            c_name.text(obj["Key"])
            c_size.text(format_size(obj["Size"]))
            c_date.text(obj["LastModified"].strftime("%Y-%m-%d %H:%M"))

            # Download File
            download_data = bb.download_file_bytes(obj["Key"])
            c_dl.download_button(
                label="📥",
                data=download_data,
                file_name=os.path.basename(obj["Key"]),
                key=f"dl_{obj['Key']}",
                help="Download file"
            )

            # Delete Single File
            if c_del.button("🗑️", key=f"del_{obj['Key']}", help="Delete file"):
                bb.delete_file(obj["Key"])
                st.success(f"Deleted `{obj['Key']}`")
                st.rerun()

# -------------------------------------------------------------------
# TAB 2: Upload Files
# -------------------------------------------------------------------
with tab_upload:
    st.subheader("Upload Local Files")
    
    upload_prefix = st.text_input("Target Directory Prefix (Optional)", value="", placeholder="e.g., ACC-100-Financial-Accounting/")
    uploaded_files = st.file_uploader("Choose files to upload", accept_multiple_files=True)

    if uploaded_files:
        if st.button("Start Upload"):
            progress_bar = st.progress(0)
            status_text = st.empty()

            for idx, uploaded_file in enumerate(uploaded_files):
                # Construct object key
                key = f"{upload_prefix.strip('/')}/{uploaded_file.name}" if upload_prefix else uploaded_file.name
                key = key.lstrip("/")

                status_text.text(f"Uploading ({idx + 1}/{len(uploaded_files)}): {uploaded_file.name}")
                
                bb.upload_fileobj(uploaded_file, key)
                progress_bar.progress((idx + 1) / len(uploaded_files))

            st.success(f"Successfully uploaded {len(uploaded_files)} file(s)!")

# -------------------------------------------------------------------
# TAB 3: Batch Operations
# -------------------------------------------------------------------
with tab_manage:
    st.subheader("Delete Entire Folder / Prefix")
    st.warning("⚠️ Warning: Deleting a directory prefix will delete ALL objects stored under it.")

    dir_to_delete = st.text_input("Prefix/Folder Path to Delete", placeholder="e.g. Introduction to business")

    if st.button("Delete Directory", type="primary"):
        if not dir_to_delete:
            st.error("Please enter a prefix path.")
        else:
            with st.spinner(f"Deleting all files under '{dir_to_delete}'..."):
                count = bb.delete_directory(dir_to_delete)
                if count > 0:
                    st.success(f"Successfully deleted {count} objects under prefix `{dir_to_delete}`.")
                else:
                    st.info(f"No objects found under prefix `{dir_to_delete}`.")