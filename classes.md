# Project Context: pciuAsec

## Project Structure

```
data/
    classes.json
layouts/
    partials/
        class_card.html
```

## Project Files

### data/classes.json

```json
{
  "semester": "Fall 2026",
  "program": "BBA",
  "batch": "BBA-37-D-A (1st semester)",
  "batch_coordinator": {
    "name": "Hafsa Binta Firdaus",
    "designation": "Lecturer, Department of Business Administration",
    "major": "HRM",
    "contact_number": "01879377124"
  },
  "schedule": {
    "Saturday": [
      {
        "time_slot": "8.30am-10.00am",
        "course_code": "ACC 100",
        "course_title": "Financial Accounting",
        "instructor": "CT-MIH",
        "room": 119,
        "note": ""
      },
      {
        "time_slot": "11.30am-1.00pm",
        "course_code": "BUS 100",
        "course_title": "Introduction to Business",
        "instructor": "SHA",
        "room": 222,
        "note": ""
      },
      {
        "time_slot": "1.30pm-03.00pm",
        "course_code": "MKT 200",
        "course_title": "Principles of Marketing",
        "instructor": "CT: MRC",
        "room": 119,
        "note": ""
      }
    ],
    "Sunday": [
      {
        "time_slot": "8.30am-10.00am",
        "course_code": "ENG 101",
        "course_title": "Composition",
        "instructor": "BBA-37-A MRF",
        "room": 218,
        "note": ""
      },
      {
        "time_slot": "10.00am-11.30am",
        "course_code": "HIST-101",
        "course_title": "History of the Emergence of Independent Bangladesh",
        "instructor": "KCB",
        "room": 219,
        "note": ""
      },
      {
        "time_slot": "1.30pm-03.00pm",
        "course_code": "MGT 200",
        "course_title": "Principles of Management",
        "instructor": "CT:AZM",
        "room": 208,
        "note": ""
      }
    ],
    "Monday": [
      {
        "time_slot": "1.30pm-03.00pm",
        "course_code": "MKT 200",
        "course_title": "Principles of Marketing",
        "instructor": "CT: MRC",
        "room": 218,
        "note": ""
      },
      {
        "time_slot": "4.30pm-6.00pm",
        "course_code": "ACC 100",
        "course_title": "Financial Accounting",
        "instructor": "CT-MIH",
        "room": 119,
        "note": ""
      }
    ],
    "Tuesday": [],
    "Wednesday": [
      {
        "time_slot": "8.30am-10.00am",
        "course_code": "HIST-101",
        "course_title": "History of the Emergence of Independent Bangladesh",
        "instructor": "KCB",
        "room": 222,
        "note": ""
      },
      {
        "time_slot": "10.00am-11.30am",
        "course_code": "MGT 200",
        "course_title": "Principles of Management",
        "instructor": "CT:AZM",
        "room": 222,
        "note": ""
      }
    ],
    "Thursday": [
      {
        "time_slot": "8.30am-10.00am",
        "course_code": "ENG 101",
        "course_title": "Composition",
        "instructor": "BBA-37-A MRF",
        "room": 119,
        "note": ""
      },
      {
        "time_slot": "10.00am-11.30am",
        "course_code": "BUS 100",
        "course_title": "Introduction to Business",
        "instructor": "CT-SHA",
        "room": 218,
        "note": ""
      }
    ],
    "Friday": []
  }
}
```

### layouts/partials/class_card.html

```html
{{ $url := "https://raw.githubusercontent.com/EiadurRahman/PCIU-A-SECTION-center/refs/heads/main/data/classes.json" }}
{{ $response := resources.GetRemote $url }}
{{ $data := dict }}

{{ if $response }}
  {{ if $response.Err }}
    {{ errorf "Failed to fetch class data from remote source: %s" $response.Err }}
  {{ else }}
    {{ $data = transform.Unmarshal $response.Content }}
  {{ end }}
{{ else }}
  {{ errorf "Unable to connect or fetch data from remote URL: %s" $url }}
{{ end }}

{{ $today := now.Format "Monday" }}
{{ $classes := index $data.schedule $today }}

<div
    class="max-w-4xl mx-auto my-4 md:my-8 p-4 md:p-6 bg-gradient-to-b from-[#2a2a2a] to-[#1c1c1c] rounded-2xl md:rounded-[2rem] text-white shadow-2xl font-sans">

    <!-- Top Info Row: Semester, Program, and Batch details -->
    <div class="flex flex-wrap justify-between gap-2 mb-4 px-1 md:px-4 text-xs font-medium tracking-wide text-neutral-400 border-b border-neutral-800 pb-3">
        <div>
            <span class="text-neutral-500">Program:</span> <span class="text-neutral-200 font-semibold">{{ $data.program }}</span>
            <span class="mx-2 text-neutral-700">|</span>
            <span class="text-neutral-500">Semester:</span> <span class="text-neutral-200 font-semibold">{{ $data.semester }}</span>
        </div>
        <div>
            <span class="text-neutral-500">Batch:</span> <span class="text-neutral-200 font-mono text-[11px] md:text-xs">{{ $data.batch }}</span>
        </div>
    </div>

    <div
        class="flex flex-col items-center mb-4 md:mb-8 px-1 md:px-4 border-b border-neutral-700/50 pb-3 md:pb-4 md:flex-row md:justify-between">
        <!-- Title: Placed on top on mobile, centered on desktop -->
        <h2 class="text-base md:text-2xl font-light tracking-widest text-neutral-200 order-1 md:order-2 mb-2 md:mb-0">
            TODAY'S CLASS
        </h2>

        <!-- Day and Date: Side-by-side on mobile, split to the outer edges on desktop -->
        <div class="flex justify-between w-full order-2 md:contents">
            <span class="text-[11px] md:text-sm font-semibold tracking-wider text-neutral-400 uppercase md:order-1">
                {{ $today }}
            </span>
            <span class="text-[11px] md:text-sm font-semibold tracking-wider text-neutral-400 md:order-3">
                {{ now.Format "02 | Jan | 2006" }}
            </span>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8">
        {{ if $classes }}
        {{ range $classes }}
        <div
            class="bg-neutral-500/20 backdrop-blur-md border border-neutral-600/30 rounded-xl md:rounded-[1.5rem] p-3.5 md:p-5 flex flex-col justify-between min-h-[110px] md:min-h-[140px] hover:bg-neutral-500/30 transition duration-300">
            <div>
                <h3 class="text-sm md:text-base font-medium text-neutral-100 leading-snug">
                    {{ .course_title }}
                </h3>
                <p class="text-xs md:text-sm text-neutral-300 mt-0.5 md:mt-1">
                    {{ .course_code }} &nbsp;&nbsp; {{ .instructor }}
                </p>
            </div>
            <div
                class="mt-3 md:mt-4 border-t border-neutral-600/20 pt-1.5 md:pt-2 text-[11px] md:text-xs text-neutral-400 space-y-0.5 md:space-y-1">
                <p>Room : {{ .room }}</p>
                <p>{{ .time_slot }}</p>
            </div>
        </div>
        {{ end }}
        {{ else }}
        <div
            class="col-span-1 md:col-span-3 py-8 md:py-12 text-center text-neutral-400 bg-neutral-500/10 rounded-xl md:rounded-[1.5rem] border border-dashed border-neutral-700">
            <p class="text-sm md:text-lg font-light">No classes scheduled for today!</p>
            <p class="text-[10px] md:text-xs text-neutral-500 mt-0.5">Enjoy your day off.</p>
        </div>
        {{ end }}
    </div>

    <!-- Batch Coordinator details fetched dynamically -->
    <div
        class="bg-neutral-500/15 backdrop-blur-md border border-neutral-600/25 rounded-xl md:rounded-[1.5rem] p-4 md:p-6 text-xs md:text-sm text-neutral-300 space-y-1.5 md:space-y-1">
        <div class="flex flex-row items-baseline gap-1.5">
            <span class="font-semibold text-neutral-100 min-w-[110px] md:min-w-[150px] shrink-0">Batch Coordinator:</span>
            <span class="truncate">{{ $data.batch_coordinator.name }}</span>
        </div>
        <div class="flex flex-row items-baseline gap-1.5">
            <span class="font-semibold text-neutral-100 min-w-[110px] md:min-w-[150px] shrink-0">Designation:</span>
            <span class="text-neutral-400 truncate">({{ $data.batch_coordinator.designation }})</span>
        </div>
        {{ with $data.batch_coordinator.major }}
        <div class="flex flex-row items-baseline gap-1.5">
            <span class="font-semibold text-neutral-100 min-w-[110px] md:min-w-[150px] shrink-0">Major:</span>
            <span class="text-neutral-300 truncate">{{ . }}</span>
        </div>
        {{ end }}
        <div class="flex flex-row items-baseline gap-1.5">
            <span class="font-semibold text-neutral-100 min-w-[110px] md:min-w-[150px] shrink-0">Contact Number:</span>
            <span class="font-mono text-neutral-200">{{ $data.batch_coordinator.contact_number }}</span>
        </div>
    </div>
</div>
```

