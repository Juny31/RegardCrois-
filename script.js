 // Initialisation
        document.addEventListener('DOMContentLoaded', function () {
            updateStats();
            loadSavedData();
        });

        // Mise à jour des statistiques
        function updateStats() {
            const tasks = document.querySelectorAll('.task-row');
            const totalTasks = tasks.length;
            const completedTasks = document.querySelectorAll('.status-select option[value="done"]:checked').length;
            const contacts = document.querySelectorAll('.contact-item').length;
            const contactedPeople = document.querySelectorAll('select option[value="contacted"]:checked, select option[value="responded"]:checked, select option[value="confirmed"]:checked').length;

            document.getElementById('total-tasks').textContent = totalTasks;
            document.getElementById('completed-tasks').textContent = completedTasks;
            document.getElementById('total-contacts').textContent = contacts;
            document.getElementById('contacted-people').textContent = contactedPeople;

            // Mise à jour de la barre de progression
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            document.getElementById('global-progress').style.width = progress + '%';
            document.getElementById('progress-text').textContent = progress + '% complété';

            saveData();
        }

        // Mise à jour du statut des tâches
        function updateTaskStatus(select) {
            const row = select.closest('.task-row');
            const cells = row.querySelectorAll('.task-cell');

            // Appliquer la couleur selon le statut
            cells.forEach(cell => {
                cell.classList.remove('status-todo', 'status-progress', 'status-done', 'status-blocked');
                cell.classList.add('status-' + select.value);
            });

            updateStats();
        }

        // Ajouter une nouvelle tâche
        function addTask() {
            const taskGrid = document.getElementById('task-grid');
            const newRow = document.createElement('div');
            newRow.className = 'task-row';
            newRow.innerHTML = `
                <div class="task-cell">
                    <input type="text" placeholder="Nom de la tâche" style="font-weight: bold; margin-bottom: 5px;">
                    <br>
                    <input type="text" placeholder="Description détaillée" style="font-size: 12px;">
                </div>
                <div class="task-cell">
                    <select class="team-select" onchange="updateStats()">
                        <option value="">Assigner à...</option>
                                <option value="Sarah">Dany Junior</option>
                                <option value="Ahmed">Grace</option>
                                <option value="Marie">Jude</option>
                        <option value="Autre">Autre...</option>
                    </select>
                </div>
                <div class="task-cell">
                    <input type="date">
                </div>
                <div class="task-cell">
                    <select class="status-select" onchange="updateTaskStatus(this)">
                        <option value="todo" class="status-todo">À faire</option>
                        <option value="progress" class="status-progress">En cours</option>
                        <option value="done" class="status-done">Terminé</option>
                        <option value="blocked" class="status-blocked">Bloqué</option>
                    </select>
                </div>
                <div class="task-cell">
                    <textarea placeholder="Ajouter des notes..."></textarea>
                    <button class="btn btn-danger" style="margin-top: 10px; font-size: 12px;" onclick="removeTask(this)">Supprimer</button>
                </div>
            `;
            taskGrid.appendChild(newRow);
            updateStats();
        }

        // Supprimer une tâche
        function removeTask(button) {
            if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
                button.closest('.task-row').remove();
                updateStats();
            }
        }

        // Ajouter un nouveau contact
        function addContact() {
            const container = document.getElementById('contacts-container');
            const newContact = document.createElement('div');
            newContact.className = 'contact-item priority-medium';
            newContact.innerHTML = `
                <div class="contact-name">
                    <input type="text" placeholder="Nom du contact/organisation" style="font-weight: bold; font-size: 1.1em; border: none; width: 100%; background: transparent;">
                </div>
                <p><strong>Profil :</strong> 
                    <input type="text" placeholder="Description du profil, expertise, rôle..." style="border: none; width: 70%; background: transparent;">
                </p>
                <div class="contact-info">
                    <div class="contact-field">
                        <label>Email/Contact</label>
                        <input type="text" placeholder="Coordonnées de contact">
                    </div>
                    <div class="contact-field">
                        <label>Statut Contact</label>
                        <select onchange="updateStats()">
                            <option value="not-contacted">Non contacté</option>
                            <option value="contacted">Contacté</option>
                            <option value="responded">A répondu</option>
                            <option value="confirmed">Confirmé</option>
                            <option value="declined">Refusé</option>
                        </select>
                    </div>
                    <div class="contact-field">
                        <label>Priorité</label>
                        <select onchange="updateContactPriority(this)">
                            <option value="high">Haute</option>
                            <option value="medium" selected>Moyenne</option>
                            <option value="low">Basse</option>
                        </select>
                    </div>
                </div>
                <div class="contact-field" style="margin-top: 15px;">
                    <label>Notes et Approche</label>
                    <textarea placeholder="Stratégie d'approche, angles d'interview, notes importantes..."></textarea>
                </div>
                <button class="btn btn-danger" style="margin-top: 10px; font-size: 12px;" onclick="removeContact(this)">Supprimer ce contact</button>
            `;
            container.appendChild(newContact);
            updateStats();
        }

        // Supprimer un contact
        function removeContact(button) {
            if (confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
                button.closest('.contact-item').remove();
                updateStats();
            }
        }

        // Mettre à jour la priorité d'un contact
        function updateContactPriority(select) {
            const contactItem = select.closest('.contact-item');
            contactItem.classList.remove('priority-high', 'priority-medium', 'priority-low');
            contactItem.classList.add('priority-' + select.value);
            saveData();
        }

        // Exporter les données
        function exportData() {
            const data = {
                tasks: [],
                contacts: [],
                notes: document.querySelector('.notes-section .editable').innerHTML,
                timestamp: new Date().toISOString()
            };

            // Exporter les tâches
            document.querySelectorAll('.task-row').forEach(row => {
                const cells = row.querySelectorAll('.task-cell');
                if (cells.length >= 5) {
                    data.tasks.push({
                        task: cells[0].textContent || cells[0].querySelector('input')?.value || '',
                        responsible: cells[1].querySelector('select')?.value || '',
                        deadline: cells[2].querySelector('input')?.value || '',
                        status: cells[3].querySelector('select')?.value || '',
                        notes: cells[4].querySelector('textarea')?.value || ''
                    });
                }
            });

            // Exporter les contacts
            document.querySelectorAll('.contact-item').forEach(item => {
                const name = item.querySelector('.contact-name input')?.value || item.querySelector('.contact-name').textContent;
                const fields = item.querySelectorAll('.contact-field input, .contact-field select, .contact-field textarea');
                data.contacts.push({
                    name: name,
                    email: fields[0]?.value || '',
                    status: fields[1]?.value || '',
                    priority: fields[2]?.value || '',
                    notes: fields[3]?.value || ''
                });
            });

            // Créer et télécharger le fichier JSON
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `regard-croise-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // Sauvegarder les données localement
        function saveData() {
            const data = {
                tasks: [],
                contacts: [],
                editableContent: {}
            };

            // Sauvegarder les tâches
            document.querySelectorAll('.task-row').forEach((row, index) => {
                const cells = row.querySelectorAll('.task-cell');
                if (cells.length >= 5) {
                    data.tasks.push({
                        task: cells[0].querySelector('input')?.value || cells[0].textContent,
                        responsible: cells[1].querySelector('select')?.value || '',
                        deadline: cells[2].querySelector('input')?.value || '',
                        status: cells[3].querySelector('select')?.value || 'todo',
                        notes: cells[4].querySelector('textarea')?.value || ''
                    });
                }
            });

            // Sauvegarder les champs éditables
            document.querySelectorAll('.editable').forEach((element, index) => {
                data.editableContent[index] = element.innerHTML;
            });

            // Sauvegarder tous les champs de formulaire
            document.querySelectorAll('input, select, textarea').forEach(field => {
                if (field.id || field.name) {
                    data[field.id || field.name] = field.value;
                }
            });

            try {
                // Note: localStorage n'est pas disponible dans cet environnement,
                // mais dans un vrai contexte web, cette ligne fonctionnerait
                // localStorage.setItem('regardCroiseData', JSON.stringify(data));
            } catch (e) {
                console.log('Sauvegarde en cours...');
            }
        }

        // Charger les données sauvegardées
        function loadSavedData() {
            try {
                // Note: cette fonction serait opérationnelle dans un vrai environnement web
                // const savedData = localStorage.getItem('regardCroiseData');
                // if (savedData) {
                //     const data = JSON.parse(savedData);
                //     // Restaurer les données...
                // }
            } catch (e) {
                console.log('Chargement des données...');
            }
        }

        // Sauvegarder automatiquement toutes les 30 secondes
        setInterval(saveData, 30000);

        // Sauvegarder avant de quitter la page
        window.addEventListener('beforeunload', saveData);

        // Gestionnaire pour les champs éditables
        document.querySelectorAll('.editable').forEach(element => {
            element.addEventListener('input', saveData);
            element.addEventListener('blur', saveData);
        });

        // Gestionnaire pour tous les champs de formulaire
        document.addEventListener('change', function (e) {
            if (e.target.matches('input, select, textarea')) {
                saveData();
                if (e.target.matches('.status-select')) {
                    updateTaskStatus(e.target);
                }
                if (e.target.matches('.team-select, select[onchange*="updateStats"]')) {
                    updateStats();
                }
            }
        });

        // Fonction de recherche/filtre
        function filterContent(searchTerm) {
            const items = document.querySelectorAll('.contact-item, .task-row');
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm.toLowerCase()) || searchTerm === '') {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Ajouter une barre de recherche dynamique
        const searchBar = document.createElement('div');
        searchBar.style.position = 'fixed';
        searchBar.style.top = '20px';
        searchBar.style.right = '20px';
        searchBar.style.background = 'white';
        searchBar.style.padding = '10px';
        searchBar.style.borderRadius = '8px';
        searchBar.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        searchBar.style.zIndex = '1000';
        searchBar.innerHTML = `
            <input type="text" placeholder="🔍 Rechercher..." style="border: 1px solid #ddd; padding: 8px; border-radius: 4px; width: 200px;" onkeyup="filterContent(this.value)">
        `;
        document.body.appendChild(searchBar);

        // Notification de sauvegarde
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.background = '#27ae60';
            notification.style.color = 'white';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '6px';
            notification.style.zIndex = '1001';
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Améliorer la fonction de sauvegarde avec notification
        const originalSaveData = saveData;
        saveData = function () {
            originalSaveData();
            // showNotification('✅ Données sauvegardées');
        };

        async function requestSaveViaIssue(data) {
            const GITHUB_TOKEN = "ghp_ISSUE_ONLY_TOKEN"; // À créer plus bas, voir Étape 4
            const REPO = "TON_UTILISATEUR/TON_DEPOT";

            const issueTitle = "Mise à jour des données JSON";
            const issueBody = `
**[DONNEES A SAUVER]**
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`
`;

            const res = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
                method: "POST",
                headers: {
                    "Authorization": `token ${GITHUB_TOKEN}`,
                    "Accept": "application/vnd.github.v3+json"
                },
                body: JSON.stringify({
                    title: issueTitle,
                    body: issueBody
                })
            });

            const json = await res.json();
            if (res.ok) {
                console.log("✅ Requête de sauvegarde envoyée :", json.html_url);
                alert("Demande de sauvegarde envoyée. Elle sera traitée dans quelques secondes.");
            } else {
                console.error("Erreur :", json);
                alert("Erreur lors de la création de la demande GitHub.");
            }
        }


        async function saveDataToGitHub(data) {
            const repo = "TON_UTILISATEUR_GITHUB/NOM_DU_DEPOT"; // ex: "juny31/regardcroise"
            const filename = "data.json";
            const branch = "main";
            const token = "TON_TOKEN_PERSONNEL_ICI";

            const apiUrl = `https://api.github.com/repos/${repo}/contents/${filename}`;

            // Étape 1 : on récupère le SHA actuel du fichier
            let sha = null;
            try {
                const res = await fetch(apiUrl, {
                    headers: {
                        "Authorization": `token ${token}`,
                        "Accept": "application/vnd.github+json"
                    }
                });
                if (res.ok) {
                    const json = await res.json();
                    sha = json.sha;
                }
            } catch (e) {
                console.error("Erreur lors de la récupération du SHA :", e);
            }

            // Étape 2 : on encode les données en base64
            const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

            // Étape 3 : envoi à GitHub
            const body = {
                message: "Mise à jour auto depuis l’interface web",
                content: content,
                branch: branch,
                ...(sha && { sha }) // SHA requis pour mise à jour
            };

            try {
                const res = await fetch(apiUrl, {
                    method: "PUT",
                    headers: {
                        "Authorization": `token ${token}`,
                        "Accept": "application/vnd.github+json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                });

                const result = await res.json();
                if (res.ok) {
                    console.log("✅ Données sauvegardées sur GitHub !", result);
                } else {
                    console.error("❌ Erreur lors de l'envoi :", result);
                }
            } catch (e) {
                console.error("Erreur fatale :", e);
            }
        }

        saveDataToGitHub(data);
