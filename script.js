document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('book-form');
  const list = document.getElementById('book-list');

  const modal = document.getElementById('modal-confirm');
  const modalMessage = document.getElementById('modal-message');
  const cancelBtn = document.getElementById('cancel-btn');
  const confirmBtn = document.getElementById('confirm-btn');

  let biblioteca = JSON.parse(localStorage.getItem('biblioteca')) || [];
  let editIndex = null;
  let deleteIndex = null; // índice del libro a eliminar

  function save() {
    localStorage.setItem('biblioteca', JSON.stringify(biblioteca));
  }

  function render() {
  list.innerHTML = '';

  if (biblioteca.length === 0) {
    list.innerHTML = '<p>No hay libros aún.</p>';
    return;
  }

  biblioteca.forEach((libro, index) => {
    const isChecked = libro.estado === 'leido' ? 'checked' : '';

    const div = document.createElement('div');
    div.className = 'book-card';
    div.innerHTML = `
      <img src="${libro.portada || 'https://via.placeholder.com/80x120'}" width="80" height="120">
      <div>
        <h3>${libro.titulo}</h3>
        <p>${libro.autor}</p>
        <small>${libro.genero} • <strong>${libro.estado}</strong></small>
        <div style="margin-top:5px;">
          <label class="switch">
            <input type="checkbox" class="toggle-status" data-index="${index}" ${isChecked}>
            <span class="slider"></span>
          </label>
          <button data-index="${index}" class="edit-btn">✏️ Editar</button>
          <button data-index="${index}" class="delete-btn">🗑️ Eliminar</button>
        </div>
      </div>
    `;
    list.appendChild(div);
  });

  // Cambiar estado con switch
  document.querySelectorAll('.toggle-status').forEach(input => {
    input.addEventListener('change', (e) => {
      const idx = e.target.getAttribute('data-index');
      biblioteca[idx].estado = e.target.checked ? 'leido' : 'pendiente';
      save();
      render();
    });
  });

    // Eliminar con modal
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        deleteIndex = e.target.getAttribute('data-index');
        modalMessage.textContent = `¿Seguro que quieres eliminar "${biblioteca[deleteIndex].titulo}"?`;
        modal.style.display = 'flex';
      });
    });

    // Editar
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.target.getAttribute('data-index');
        const libro = biblioteca[idx];
        document.getElementById('titulo').value = libro.titulo;
        document.getElementById('autor').value = libro.autor;
        document.getElementById('genero').value = libro.genero;
        document.getElementById('portada').value = libro.portada;
        document.getElementById('estado').value = libro.estado;
        editIndex = idx;
      });
    });
  }

  // Botón cancelar modal
  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    deleteIndex = null;
  });

  // Botón confirmar modal
  confirmBtn.addEventListener('click', () => {
    if (deleteIndex !== null) {
      biblioteca.splice(deleteIndex, 1);
      save();
      render();
    }
    modal.style.display = 'none';
    deleteIndex = null;
  });

  // Cerrar modal haciendo click fuera del contenido
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      deleteIndex = null;
    }
  });

  // Guardar y actualizar libros
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nuevo = {
      titulo: document.getElementById('titulo').value.trim(),
      autor: document.getElementById('autor').value.trim(),
      genero: document.getElementById('genero').value,
      portada: document.getElementById('portada').value.trim(),
      estado: document.getElementById('estado').value
    };

    if (editIndex !== null) {
      biblioteca[editIndex] = nuevo;
      editIndex = null;
    } else {
      biblioteca.push(nuevo);
    }

    save();
    render();
    form.reset();
  });

  render();
});
