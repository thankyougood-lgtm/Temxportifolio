// 1. DATA FOR YOUR PROJECTS
const projectsData = [
  {
    category: 'PWA / MOBILE',
    title: 'Notes App',
    description: 'A clean, responsive note-taking application with search, folders, favorites, and trash features. Built for quick productivity.',
    tags: ['HTML', 'CSS', 'JS', 'Tailwind'],
    image: './assets/noteapp.png', // Save your note app image here
    
    liveLink: 'https://thankyougood-lgtm.github.io/note-app/',
    githubLink: 'https://github.com/thankyougood-lgtm/note-app'
  },
  {
    category: 'DASHBOARD',
    title: 'Super Excel (Markbook)',
    description: 'A powerful, offline-capable markbook and attendance system for teachers. Features easy mark entry, data analysis charts, and Excel exports.',
    tags: ['React', 'TypeScript', 'PWA', 'Data'],
    image: './assets/supperexcle.png', // Save your markbook image here
    liveLink: '#',
    githubLink: '#'
  },
  {
    category: 'WEB APP/PWA APP',
    title: 'Grade Tracker',
    description: 'A student management interface for teachers. Includes intuitive data entry, quick undo/redo, and a clean mobile-first dashboard.',
    tags: ['React', 'Node.js', 'UI/UX'],
    image: './assets/markbook-app.png', // Save your third app image here
    liveLink: '#',
    githubLink: '#'
  }
];

// 2. RENDER PROJECTS TO THE SCREEN
const projectsGrid = document.getElementById('projectsGrid');

if (projectsGrid) {
  projectsGrid.innerHTML = projectsData
    .map(
      (project) => `
        <article class="project-card">
          <img src="${project.image}" alt="${project.title} screenshot" onerror="this.src='https://via.placeholder.com/400x200?text=Image+Not+Found'">
          
          <span class="project-tag">${project.category}</span>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          
          <div class="project-meta">
            ${project.tags.map((tag) => `<span>${tag}</span>`).join('')}
          </div>
          
          <div class="project-links">
            <a href="${project.liveLink}" target="_blank" class="btn-primary">Live Demo</a>
            <a href="${project.githubLink}" target="_blank" class="btn-secondary">GitHub Code</a>
          </div>
        </article>
      `
    )
    .join('');
}

// 3. PROFILE PICTURE UPLOAD LOGIC
const profileInput = document.getElementById('profileInput');
const profileImage = document.getElementById('profileImage');
const profileUploadTrigger = document.querySelector('.profile-upload-trigger');

if (profileUploadTrigger) {
  profileUploadTrigger.addEventListener('click', () => {
    profileInput.click();
  });

  profileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      profileImage.src = loadEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
}