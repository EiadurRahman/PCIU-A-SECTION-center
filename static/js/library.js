(function () {
  const COURSES = [
    { code: "ACC-100", name: "Financial Accounting" },
    { code: "BUS 100", name: "Introduction to Business" },
    { code: "ENG 101", name: "English Composition" },
    { code: "HIST-101", name: "History of Bangladesh" },
    { code: "MGT 200", name: "Principles of Management" },
    { code: "MKT 200", name: "Principles of Marketing" },
  ];
  const CATEGORIES = [
    { code: "CLS-CONTENT", name: "Class Content" },
    { code: "CLS-NOTE", name: "Class Notes" },
    { code: "HW", name: "Homework" },
  ];

  const $ = (id) => document.getElementById(id);
  const loading = $("lib-loading");
  const errorBox = $("lib-error");
  const coursesEl = $("lib-courses");
  const categoriesEl = $("lib-categories");
  const filesEl = $("lib-files");
  const breadcrumb = $("lib-breadcrumb");
  const cardTpl = $("tpl-card");
  const fileRowTpl = $("tpl-file-row");

  let tree = {}; // tree[course][category] = { files: [], subfolders: { "01": [files] } }
  let state = { view: "courses", course: null, category: null, subfolder: null };

  function formatBytes(bytes) {
    if (!bytes) return "0 B";
    const k = 1024, sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  function buildTree(files) {
    const t = {};
    for (const c of COURSES) {
      t[c.code] = {};
      for (const cat of CATEGORIES) t[c.code][cat.code] = { files: [], subfolders: {} };
    }
    for (const f of files) {
      const parts = f.key.split("/");
      const [course, category] = parts;
      if (!t[course] || !t[course][category]) continue; // ignore keys outside the fixed convention
      if (category === "HW" && parts.length === 4) {
        const [, , num, filename] = parts;
        (t[course][category].subfolders[num] ||= []).push({ ...f, name: filename });
      } else if (parts.length === 3) {
        const [, , filename] = parts;
        t[course][category].files.push({ ...f, name: filename });
      }
    }
    return t;
  }

  async function load() {
    try {
      const res = await fetch("/.netlify/functions/list-files");
      if (!res.ok) throw new Error("Bad response");
      const data = await res.json();
      tree = buildTree(data.files || []);
      loading.classList.add("hidden");
      render();
    } catch (err) {
      loading.classList.add("hidden");
      errorBox.textContent = "Couldn't load the library. Try refreshing.";
      errorBox.classList.remove("hidden");
    }
  }

  function setView(view, extra = {}) {
    state = { view, course: null, category: null, subfolder: null, ...extra };
    render();
  }

  function renderBreadcrumb() {
    const crumbs = [{ label: "Courses", onClick: () => setView("courses") }];
    if (state.course) {
      const c = COURSES.find((x) => x.code === state.course);
      crumbs.push({ label: c.name, onClick: () => setView("categories", { course: state.course }) });
    }
    if (state.category) {
      const cat = CATEGORIES.find((x) => x.code === state.category);
      crumbs.push({
        label: cat.name,
        onClick: () => setView("files", { course: state.course, category: state.category }),
      });
    }
    if (state.subfolder) {
      crumbs.push({ label: `Assignment ${state.subfolder}`, onClick: null });
    }

    breadcrumb.innerHTML = "";
    if (crumbs.length <= 1) {
      breadcrumb.classList.add("hidden");
      return;
    }
    breadcrumb.classList.remove("hidden");
    crumbs.forEach((crumb, i) => {
      const isLast = i === crumbs.length - 1;
      const el = document.createElement(crumb.onClick ? "button" : "span");
      el.textContent = crumb.label;
      if (crumb.onClick) {
        el.type = "button";
        el.className =
          "shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium bg-white/40 dark:bg-black/50 border border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 hover:bg-white/70 dark:hover:bg-black/70 hover:text-black dark:hover:text-white active:scale-95 transition-all duration-150";
        el.addEventListener("click", crumb.onClick);
      } else {
        el.className =
          "shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-semibold bg-indigo-600/90 text-white";
      }
      breadcrumb.appendChild(el);
      if (!isLast) {
        const sep = document.createElement("span");
        sep.textContent = "›";
        sep.className = "shrink-0 text-black/30 dark:text-white/30 px-0.5";
        breadcrumb.appendChild(sep);
      }
    });
  }

  function makeCard(codeText, nameText, metaText, onClick) {
    const node = cardTpl.content.cloneNode(true);
    node.querySelector(".card-code").textContent = codeText;
    node.querySelector(".card-name").textContent = nameText;
    node.querySelector(".card-meta").textContent = metaText;
    node.querySelector(".lib-card").addEventListener("click", onClick);
    return node;
  }

  function makeFileRow(file, key) {
    const node = fileRowTpl.content.cloneNode(true);
    node.querySelector(".file-name").textContent = file.name;
    node.querySelector(".file-size").textContent = formatBytes(file.size);
    const btn = node.querySelector(".file-download");
    btn.addEventListener("click", () => downloadFile(key, btn));
    return node;
  }


  async function downloadFile(key, btn) {
    const label = btn.querySelector(".dl-label");
    const spinner = btn.querySelector(".dl-spinner");
    btn.disabled = true;
    spinner.classList.remove("hidden");
    label.textContent = "Downloading…";
    try {
      const res = await fetch(`/.netlify/functions/presign-download?key=${encodeURIComponent(key)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      window.open(data.url, "_blank");
    } catch (err) {
      alert("Couldn't get download link. Try again.");
    } finally {
      spinner.classList.add("hidden");
      label.textContent = "Download";
      btn.disabled = false;
    }
  }

  function render() {
    [coursesEl, categoriesEl, filesEl].forEach((el) => el.classList.add("hidden"));
    renderBreadcrumb();

    if (state.view === "courses") {
      coursesEl.innerHTML = "";
      coursesEl.classList.remove("hidden");
      for (const c of COURSES) {
        const cat = tree[c.code];
        const total = CATEGORIES.reduce((sum, k) => {
          const bucket = cat[k.code];
          return sum + bucket.files.length + Object.values(bucket.subfolders).flat().length;
        }, 0);
        coursesEl.appendChild(
          makeCard(c.code, c.name, total === 0 ? "No files yet" : `${total} file${total === 1 ? "" : "s"}`, () =>
            setView("categories", { course: c.code })
          )
        );
      }
    }

    if (state.view === "categories") {
      categoriesEl.innerHTML = "";
      categoriesEl.classList.remove("hidden");
      for (const cat of CATEGORIES) {
        const bucket = tree[state.course][cat.code];
        const count = bucket.files.length + Object.values(bucket.subfolders).flat().length;
        categoriesEl.appendChild(
          makeCard(cat.code, cat.name, count === 0 ? "Empty" : `${count} file${count === 1 ? "" : "s"}`, () =>
            setView("files", { course: state.course, category: cat.code })
          )
        );
      }
    }

    if (state.view === "files") {
      filesEl.innerHTML = "";
      filesEl.classList.remove("hidden");
      const bucket = tree[state.course][state.category];

      if (state.category === "HW" && !state.subfolder) {
        const nums = Object.keys(bucket.subfolders).sort();
        if (nums.length === 0) {
          filesEl.innerHTML = `<p class="text-center py-8 text-black/40 dark:text-white/40">No homework uploaded yet.</p>`;
          return;
        }
        for (const num of nums) {
          filesEl.appendChild(
            makeCard(`Assignment ${num}`, `${bucket.subfolders[num].length} file(s)`, "", () =>
              setView("files", { course: state.course, category: state.category, subfolder: num })
            )
          );
        }
        return;
      }

      const files = state.subfolder ? bucket.subfolders[state.subfolder] : bucket.files;
      if (!files || files.length === 0) {
        filesEl.innerHTML = `<p class="text-center py-8 text-black/40 dark:text-white/40">No files here yet.</p>`;
        return;
      }
      for (const f of files) {
        filesEl.appendChild(makeFileRow(f, f.key));
      }
    }
  }

  load();
})();
