const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
  if (inputBox.value === "") {
    alert("You must write something!");
  } else {
    const li = document.createElement("li");
    li.textContent = inputBox.value;

    const span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    listContainer.appendChild(li);
  }

  inputBox.value = "";
  saveData();
  updateProgress();
}

function handleClick(e) {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    saveData();
    updateProgress();
  } else if (e.target.tagName === "SPAN") {
    e.target.parentElement.remove();
    saveData();
    updateProgress();
  }
}

// Добавим обработчик двойного клика на список
listContainer.addEventListener("dblclick", function (e) {
  if (e.target.tagName === "LI") {
    const li = e.target;
    // Создаём поле ввода, которое заменит текст задачи
    const input = document.createElement("input");
    input.type = "text";
    input.value = li.textContent.replace("\u00d7", "").trim(); // Убираем крестик из текста

    // Заменяем содержимое li на input
    li.textContent = "";
    li.appendChild(input);
    input.focus();

    // По окончании редактирования или потере фокуса сохраняем текст обратно
    function finishEditing() {
      if (input.value.trim() === "") {
        alert("Task text can't be empty!");
        return;
      }
      li.textContent = input.value;
      // Добавляем обратно крестик
      const span = document.createElement("span");
      span.innerHTML = "\u00d7";
      li.appendChild(span);

      saveData();
    }

    input.addEventListener("blur", finishEditing);
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        finishEditing();
      }
      if (event.key === "Escape") {
        // Отмена редактирования — возвращаем старый текст
        li.textContent = input.value;
        const span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
      }
    });
  }
});

listContainer.addEventListener("click", handleClick);

function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
  listContainer.innerHTML = localStorage.getItem("data") || "";
  updateProgress();
}

function updateProgress() {
  const allTasks = listContainer.querySelectorAll("li");
  const completedTasks = listContainer.querySelectorAll("li.checked");

  const progressWrapper = document.getElementById("progress-wrapper");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  if (!progressWrapper || !progressBar || !progressText) return;

  if (allTasks.length === 0) {
    progressWrapper.style.display = "none";
    return;
  }

  progressWrapper.style.display = "block";
  const percent = Math.round((completedTasks.length / allTasks.length) * 100);
  progressBar.style.width = percent + "%";
  progressText.textContent = `${percent}% completed`;
}

// Показываем задачи при загрузке страницы
showTask();
