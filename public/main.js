document.addEventListener('DOMContentLoaded', function () {
    const profilePic = document.getElementById('profilePic');
    const dropdownMenu = document.getElementById('dropdownMenu');

    profilePic.addEventListener('click', function () {
        dropdownMenu.classList.toggle('show');
    });

    // Close the dropdown if clicked outside of it
    document.addEventListener('click', function (e) {
        if (!profilePic.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const membersTable = document.getElementById('membersBody');
    const addMemberForm = document.getElementById('addMemberForm');

    // Fetch and display members
    const loadMembers = () => {
        fetch('/profile/members')
            .then(response => response.json())
            .then(members => {
                membersTable.innerHTML = '';
                members.forEach(member => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${member.id}</td>
                        <td><input type="text" value="${member.name}" data-id="${member.id}" class="edit-name"></td>
                        <td><input type="email" value="${member.email}" data-id="${member.id}" class="edit-email"></td>
                        <td>
                            <button class="update-btn" data-id="${member.id}">Update</button>
                            <button class="delete-btn" data-id="${member.id}">Delete</button>
                        </td>
                    `;
                    membersTable.appendChild(row);
                });
                addEventListeners();
            });
    };

    // Add a new member
    addMemberForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newMember = {
            id: document.getElementById('newId').value,
            name: document.getElementById('newName').value,
            email: document.getElementById('newEmail').value
        };
        fetch('/profile/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMember)
        }).then(() => {
            loadMembers();
            addMemberForm.reset();
        });
    });

    // Update or delete member
    const addEventListeners = () => {
        document.querySelectorAll('.update-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const name = document.querySelector(`input.edit-name[data-id="${id}"]`).value;
                const email = document.querySelector(`input.edit-email[data-id="${id}"]`).value;
                const updatedMember = { id, name, email };

                fetch(`/profile/update/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedMember)
                }).then(() => loadMembers());
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                fetch(`/profile/delete/${id}`, {
                    method: 'DELETE'
                }).then(() => loadMembers());
            });
        });
    };

    // Initial load
    loadMembers();
});

