window.onload = () => {
  let themes = [
    {
      "primary-100": "#ff6b6b",
      "primary-200": "#dd4d51",
      "primary-300": "#8f001a",
      "accent-100": "#00ffff",
      "accent-200": "#00999b",
      "text-100": "#ffffff",
      "text-200": "#e0e0e0",
      "bg-100": "#0f0f0f",
      "bg-200": "#1f1f1f",
      "bg-300": "#353535",
    },
    {
      "primary-100": "#FFD700",
      "primary-200": "#ddb900",
      "primary-300": "#917800",
      "accent-100": "#c49216",
      "accent-200": "#5e3b00",
      "text-100": "#dcdcdc",
      "text-200": "#929292",
      "bg-100": "#1E1E1E",
      "bg-200": "#2d2d2d",
      "bg-300": "#454545",
    },
    {
      "primary-100": "#4CAF50",
      "primary-200": "#2a9235",
      "primary-300": "#0a490a",
      "accent-100": "#FFC107",
      "accent-200": "#916400",
      "text-100": "#333333",
      "text-200": "#5c5c5c",
      "bg-100": "#e6fbe3",
      "bg-200": "#dcf1d9",
      "bg-300": "#b4c8b1",
    },
  ];

  themes.forEach((theme) => {
    themeList.innerHTML += `
        <li>
          <span style="background-color: ${theme["bg-100"]}"></span>
          <span style="background-color: ${theme["primary-100"]}"></span>
          <span style="background-color: ${theme["primary-200"]}"></span>
          <span style="background-color: ${theme["accent-100"]}"></span>
          <span style="background-color: ${theme["accent-200"]}"></span>
        </li>`;
  });

  let theme = JSON.parse(localStorage.getItem("theme")) || themes[0];

  changeTheme(theme);

  //=========================================================

  document.addEventListener("click", (e) => {
    if (e.target.closest("#themeBtn")) {
      if (themeList.style.cssText == "") {
        themeBtn.style.cssText = "background-color: var(--bg-300)";
        themeList.style.cssText = "display: block";
      } else {
        themeBtn.style.cssText = "";
        themeList.style.cssText = "";
      }
    }

    if (!e.target.closest("#themeBtn")) {
      themeBtn.style.cssText = "";
      themeList.style.display = "";
    }

    if (e.target.closest("#themeList li")) {
      let index = Array.prototype.indexOf.call(
        e.target.closest("#themeList li").parentNode.children,
        e.target.closest("#themeList li")
      );
      theme = themes[index];
      changeTheme(theme);
    }
  });

  function changeTheme(theme) {
    let root = document.documentElement;
    for (let [key, value] of Object.entries(theme)) {
      root.style.setProperty(`--${key}`, value);
    }
    localStorage.setItem("theme", JSON.stringify(theme));
  }

  //=========================================================

  //=========================================================

  let idCount = localStorage.getItem("idCount") || 0;
  let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

  if (taskList.length !== 0) {
    taskList.forEach((task) => {
      addTask(task);
    });
  }

  //=========================================================

  function taskListAdd(title) {
    let task = {
      id: idCount++,
      title: title,
      status: "not-started",
    };

    taskList.push(task);

    addTask(task);
  }

  function escapeHTML(title) {
    let ele = document.createElement("div");
    ele.textContent = title;
    return ele.innerHTML;
  }

  function addTask(task) {
    tasks.innerHTML =
      `<div class="brow" id="${task.id}">
        <div class="title-cell">${escapeHTML(task.title)}</div>
        <span class="save"><i class="fa-solid fa-check"></i></span>
        <span class="prop">
            <li class="edit"><i class="fa-solid fa-pen-to-square"></i></li>
            <li class="delete"><i class="fa-solid fa-trash"></i></li>
        </span>
        <span class="prop-btn">•<br />•<br />•</span>
        <div class="status-cell">
        <div class="status"><div class="${task.status}"></div></div>
        </div>
        </div>` + tasks.innerHTML;
  }

  function addingTask() {
    if (taskInput.value === "") {
      taskInput.focus();
      taskInput.style.cssText = `border: solid 2px var(--accent-100)`;
    } else {
      taskInput.style.cssText = ``;

      taskListAdd(taskInput.value);

      taskInput.value = "";
    }
  }

  addBtn.addEventListener("click", addingTask);

  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addingTask();
    }
  });

  //=========================================================

  document.addEventListener("click", (e) => {
    if (e.target.closest(".prop-btn")) {
      let shown = e.target.previousElementSibling.classList.contains("show-prop");

      document.querySelectorAll(".prop").forEach((prop) => {
        prop.classList.remove("show-prop");
      });
      if (!shown) e.target.previousElementSibling.classList.add("show-prop");
    }

    if (!e.target.closest(".prop-btn")) {
      document.querySelectorAll(".prop").forEach((prop) => {
        prop.classList.remove("show-prop");
      });
    }

    if (e.target.closest("#deleteAll")) {
      taskList = [];
      tasks.innerHTML = ``;
      idCount = 0;
    }

    let taskItem, task;

    if (e.target.closest(".brow")) {
      task = e.target.closest(".brow");
      taskItem = taskList.find((item) => item.id == task.id);
    }

    if (e.target.closest(".status")) {
      let stat = e.target.closest(".status").querySelector("div");
      if (stat.className == "not-started") {
        stat.className = "in-progress";
        taskItem.status = "in-progress";
      } else if (stat.className == "in-progress") {
        stat.className = "done";
        taskItem.status = "done";
      } else {
        stat.className = "not-started";
        taskItem.status = "not-started";
      }
    }

    if (e.target.closest(".edit")) {
      task.querySelector(".save").classList.add("show-save");
      let title = task.querySelector(".title-cell");
      title.setAttribute("contenteditable", "true");
    }

    if (e.target.closest(".save")) {
      e.target.closest(".save").classList.remove("show-save");
      task.querySelector(".title-cell").removeAttribute("contenteditable");
      taskItem.title = task.querySelector(".title-cell").textContent;
    }

    if (e.target.closest(".delete")) {
      e.target.closest(".brow").remove();
      taskList = taskList.filter((item) => item.id != task.id);
      if (taskList.length === 0) idCount = 0;
    }
  });

  //=========================================================

  function storeTasks() {
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("idCount", idCount);
  }

  window.addEventListener("click", storeTasks);
  window.addEventListener("keydown", storeTasks);
};
