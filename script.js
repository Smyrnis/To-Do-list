const container = document.querySelector('.container');
const addBtn = document.querySelector('.add-postit');

const colors = [
  {bg: '#fffa75', border: '#f5e663', rotate: 0},
  {bg: '#ffb347', border: '#ffa733', rotate: 2},
  {bg: '#ff6961', border: '#e95a54', rotate: -3},
  {bg: '#77dd77', border: '#66cc66', rotate: 3},
  {bg: '#aec6cf', border: '#8ca5b3', rotate: -1}
];
let colorIndex = 0;

function createPostIt(taskText) {
  const div = document.createElement('div');
  div.className = 'postit';
  div.setAttribute('role', 'listitem');
  div.setAttribute('tabindex', '0');

  const color = colors[colorIndex];
  colorIndex = (colorIndex + 1) % colors.length;
  div.style.background = color.bg;
  div.style.borderColor = color.border;
  div.style.setProperty('--rotate', `${color.rotate}deg`);

  // Title, fallback to 'New Task'
  const h2 = document.createElement('h2');
  h2.textContent = taskText.title || " ";
  div.appendChild(h2);

  // Task container
  const taskDiv = document.createElement('div');
  taskDiv.className = 'task';

  // Checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `chk-${Date.now()}`;
  taskDiv.appendChild(checkbox);

  // Label linked to checkbox
  const label = document.createElement('label');
  label.htmlFor = checkbox.id;
  label.style.cursor = 'pointer';

  const iconSpan = document.createElement('span');
  iconSpan.className = 'icon';
  iconSpan.textContent = taskText.icon || '-'; // Default icon if none provided

  label.appendChild(iconSpan);
  label.appendChild(document.createTextNode(taskText.text));
  taskDiv.appendChild(label);

  div.appendChild(taskDiv);

  // When checkbox changes, REMOVE the post-it if checked, else do nothing
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      div.classList.add('fade-out');
      setTimeout(() => div.remove(), 500);  // Remove post-it from DOM immediately
    }
  });

  // Remove on right-click as before
  div.addEventListener('contextmenu', e => {
    e.preventDefault();
    if (confirm('Remove this task?')) {
      div.remove();
    }
  });

  if (container.contains(addBtn)) {
      container.insertBefore(div, addBtn);
  } else {
      container.appendChild(div);
  }
  
}

// Hide instructions after 15 seconds
setTimeout(() => {
  const instructions = document.querySelector('.instructions');
  if (instructions) {
    instructions.classList.add('hidden');
  }
}, 3000);
// Remove old click-to-remove behavior from existing post-its:
document.querySelectorAll('.postit').forEach(postit => {
  // Add checkboxes and done toggle for existing items
  const taskDiv = postit.querySelector('.task');
  if (taskDiv && !taskDiv.querySelector('input[type=checkbox]')) {
    const textContent = taskDiv.textContent.trim();
    taskDiv.textContent = ''; // clear text

    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `chk-existing-${Math.random().toString(36).substr(2, 9)}`;
    taskDiv.appendChild(checkbox);

    // Create label
    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.style.cursor = 'pointer';

    // Extract icon if exists
    const iconSpan = document.createElement('span');
    iconSpan.className = 'icon';
    // Simple heuristic: first char is emoji or icon in your original
    iconSpan.textContent = textContent[0];

    // The rest of the text
    const text = textContent.slice(1).trim();
    label.appendChild(iconSpan);
    label.appendChild(document.createTextNode(text));

    taskDiv.appendChild(label);

    // Toggle done on checkbox change
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        postit.remove();
      }
      
    });

    // Remove on right-click
    postit.addEventListener('contextmenu', e => {
      e.preventDefault();
      if (confirm('Remove this task?')) postit.remove();
    });
  }
});

// Add button functionality (same as before)
addBtn.addEventListener('click', showInputForm);
addBtn.addEventListener('keypress', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    showInputForm();
  }
});

function showInputForm() {
  if (document.querySelector('.input-form')) return;

  const form = document.createElement('form');
  form.className = 'input-form';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Enter task here...';
  input.required = true;
  form.appendChild(input);

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = 'Add';
  form.appendChild(btn);

  container.replaceChild(form, addBtn);

  input.focus();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const val = input.value.trim();
    if (val) {
      createPostIt({ text: val });
      container.replaceChild(addBtn, form);
    }
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      container.replaceChild(addBtn, form);
    }
  });
}
