var contactList = [];
var emergencyList = [];
var favoriteList = [];
var editingIndex = -1;

if (localStorage.getItem("contactList") !== null) {
    contactList = JSON.parse(localStorage.getItem("contactList"));
    DisplayContacts();
} else {
    document.getElementById("contacts").innerHTML = `<div id="temp-contacts"
                class="d-flex justify-content-center align-items-center flex-column align-content-between mt-5 pt-5"
            >
                <div
                class="bg-secondary-subtle text-secondary p-3 rounded-4 mb-3" 
                >
                <i class="fa-solid fa-address-book fa-2x text-gray"></i>
                </div>
                <p class="text-secondary fw-bold">No contacts found</p>
                <p class="text-secondary fw-lighter">
                Click "Add Contact" to get started
                </p>
            </div>`;
}
if (localStorage.getItem("emergencyList") !== null) {
    emergencyList = JSON.parse(localStorage.getItem("emergencyList"));
    DisplayEmergencyContacts();
} else {
    document.getElementById("emergency-contacts").innerHTML = `<p class="text-secondary text-center py-4">
                    No emergency contacts yet
                    </p>`;
}
if (localStorage.getItem("favoriteList") !== null) {
    favoriteList = JSON.parse(localStorage.getItem("favoriteList"));
    DisplayFavorites();
} else {
    document.getElementById("favorite-contacts").innerHTML = `<p class="text-secondary text-center py-4">
                    No favorite contacts yet
                    </p>`;

}

function SaveContact(event) {
    event.preventDefault();

    var firstName = document.getElementById("contactName").value;
    var phone = document.getElementById("contactPhone").value;
    var email = document.getElementById("contactEmail").value;
    var address = document.getElementById("contactAddress").value;
    var group = document.getElementById("group").value;
    var notes = document.getElementById("notes").value;
    var isFavorite = document.getElementById("btncheck1").checked;
    var isEmergency = document.getElementById("btncheck2").checked;
    
    
    var imageInput = document.getElementById("contactPhoto");
    var imageName = imageInput.files[0] ? imageInput.files[0].name : null;
    var image = imageName ? `images/${imageName}` : null;
    
    if (!IsPhoneUnique(phone)) {
        Swal.fire({
            icon: "error",
            title: "Duplicate Phone Number",
            text: "A contact with this phone number already exists: The UX Review",
        });
        return; 
    }
    
    
    var contact = {
        firstName: firstName,
        phone: phone,
        email: email,
        address: address,
        group: group,  
        notes: notes,
        isFavorite: isFavorite,
        isEmergency: isEmergency,
        image: image
    };
    
    Swal.fire({
    title: "Added!",
    icon: "success",
    draggable: true
});
    SaveContactData(contact);
}

function SaveContactData(contact) {

    if (editingIndex === -1) {
        contactList.push(contact);
    } else {
        contactList[editingIndex] = contact;
        editingIndex = -1;
    }

    localStorage.setItem("contactList", JSON.stringify(contactList));
    ClearForm();
    DisplayContacts();


    favoriteList = contactList.filter(c => c.isFavorite === true);
    emergencyList = contactList.filter(c => c.isEmergency === true);

    localStorage.setItem("favoriteList", JSON.stringify(favoriteList));
    localStorage.setItem("emergencyList", JSON.stringify(emergencyList));
    DisplayFavorites();
    DisplayEmergencyContacts();


    const modal = bootstrap.Modal.getInstance(document.getElementById("staticBackdrop"));
    if (modal) {
        modal.hide();
    }
}

function DisplayContacts() {
    console.log("Displaying contacts:");
    document.getElementById("contacts").innerHTML = '';
    document.getElementById("counter").innerText = `${contactList.length}`;
    document.getElementById("counter-2").innerText = `${contactList.length}`;
    if (contactList.length === 0) {
        document.getElementById("contacts").innerHTML = `<div id="temp-contacts"
                class="d-flex justify-content-center align-items-center flex-column align-content-between mt-5 pt-5"
            >
                <div
                class="bg-secondary-subtle text-secondary p-3 rounded-4 mb-3"
                >
                <i class="fa-solid fa-address-book fa-2x text-gray"></i>
                </div>
                <p class="text-secondary fw-bold">No contacts found</p>
                <p class="text-secondary fw-lighter">
                Click "Add Contact" to get started
                </p>
            </div>`;
    }
    var contactsHTML = '';
    for (var i = 0; i < contactList.length; i++) {
        var contact = contactList[i];
        contactsHTML += `
    <div class="col-6">
        <div class="card rounded-4 shadow-sm border-0 h-100">
        <div class="card-body">
            <div class="d-flex align-items-center mb-1">
                <div class="me-3 rounded-3 bg-blue position-relative d-flex align-items-center justify-content-center " style="width: 3rem; height: 3rem;">
                    <div class="overflow-hidden rounded-3 w-100 h-100 d-flex align-items-center justify-content-center">${contact.image ? `<img src="${contact.image}" class="w-100 h-100 object-fit-cover" alt="${contact.firstName}">` : `<span class="text-white fw-bold" style="font-size: 1.5rem;">${contact.firstName.charAt(0).toUpperCase()}</span>`}</div>
                    ${contact.isFavorite ? '<span class="position-absolute top-0 end-0 d-flex align-items-center justify-content-center" style="width: 1.5rem; height: 1.5rem; transform: translate(25%, -25%); background-color: #ffc107; border-radius: 50%; border: 2px solid white;"><i class="fa-solid fa-star text-white" style="font-size: 0.5rem;"></i></span>' : ''}
                    ${contact.isEmergency ? '<span class="position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center" style="width: 1.5rem; height: 1.5rem; transform: translate(25%, 25%); background-color: #dc3545; border-radius: 50%; border: 2px solid white;"><i class="fa-solid fa-heart-pulse text-white" style="font-size: 0.5rem;"></i></span>' : ''}
                </div>
                <div>
                    <h5 class="card-title">${contact.firstName}</h5>
                    <p class="card-text" style="font-size: 0.75rem;"> <span class="p-1 bg-blue rounded-2" ><i class="fa-solid fa-phone text-blue" style="font-size: 0.5rem;"></i></span> ${contact.phone} </p>
                </div>
            </div>
            <div class="d-flex gap-1 mt-3 flex-column">
                ${contact.email ? `<p><span class="p-2 bg-purple-light rounded-3 me-2"><i class="fa-solid fa-envelope purple font-12"></i></span>${contact.email}</p>` : ''} 
                ${contact.address ? `<p><span class="p-2 bg-success-subtle rounded-3 me-2"><i class="fa-solid fa-location-dot text-success font-12"></i></span>${contact.address} </p>` : ''}
                
                <div class="d-flex gap-1 me-2">
                    ${contact.group ? '<p class=" bg-orange-light badge rounded-3 m-0 text-orange">' + contact.group + '</p>' : ''}
                    ${contact.isEmergency ? '<p class="bg-red-light badge rounded-3 m-0 text-red"> <i class="fa-solid fa-heart-pulse"></i>Emergency </p>' : ''}
                </div>
            </div>
            
        </div>  
        <div class="card-footer bg-white border-gray rounded-bottom-4">
            <div class="d-flex justify-content-between align-items-center">  
                <div class="d-fixed gap-1">
                    <a href="tel:${contact.phone}" class="p-2 bg-success-subtle rounded-3 "><i class="fa-solid fa-phone text-success font-12"></i></a>
                    ${contact.email ? `<a href="mailto:${contact.email}" class="p-2 bg-purple-light rounded-3 "><i class="fa-solid fa-envelope purple font-12"></i></a>` : ''}
                    
                </div>
                <div class="d-flex gap-1 text-secondary">
                    ${contact.isFavorite ? `<button onclick="AddFav(${i})" class="p-2 btn btn-outline-warning bg-warning-subtle  border-0"><i class="fa-solid fa-star text-warning"></i></button>` : `<button onclick="AddFav(${i})" class="p-2 btn btn-outline-secondary border-0 hover-btn-warning"><i class="fa-regular fa-star"></i></button>`}
                    ${contact.isEmergency ? `<button onclick="AddEmr(${i})" class="p-2 btn btn-outline-danger bg-danger-subtle border-0"><i class="fa-solid fa-heart-pulse text-danger"></i></button>` : `<button onclick="AddEmr(${i})" class="p-2  btn btn-outline-secondary border-0 hover-btn-danger"><i class="fa-regular fa-heart"></i></button>`}
                    
                    <button onclick="EditContact(${i})" data-bs-toggle="modal"
            data-bs-target="#staticBackdrop" class="p-2 btn btn-outline-secondary border-0 hover-btn-info"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="DeleteAlert(${i})" class="p-2 btn btn-outline-secondary border-0 hover-btn-danger"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        </div>      
        </div>
    </div>
    `;
    }
    document.getElementById("contacts").innerHTML = contactsHTML;
}

function DisplayFavorites() {
    document.getElementById("favorite-contacts").innerHTML = '';
    document.getElementById("countFav").innerText = `${favoriteList.length}`;
    if (favoriteList.length === 0) {
        document.getElementById("favorite-contacts").innerHTML = `<p class="text-secondary text-center py-4">
                    No favorite contacts yet
                    </p>`;
    }
    for (var i = 0; i < favoriteList.length; i++) {
        var contact = favoriteList[i];
        document.getElementById("favorite-contacts").innerHTML += `
                <div class="d-flex justify-content-between px-3 py-3">

                    <div class="d-flex align-items-center mb-1 ">
                        <div class="me-3 rounded-3 bg-blue position-relative d-flex align-items-center justify-content-center " style="width: 2.5rem; height: 2.5rem;">
                    <div class="overflow-hidden rounded-3 w-100 h-100 d-flex align-items-center justify-content-center">${contact.image ? `<img src="${contact.image}" class="w-100 h-100 object-fit-cover" alt="${contact.firstName}">` : `<span class="text-white fw-bold" style="font-size: 1.5rem;">${contact.firstName.charAt(0).toUpperCase()}</span>`}</div>

                    </div>
                        <div>
                            <h6 class="card-title fw-bold mb-0">${contact.firstName}</h6>
                            <p class="card-text m-0" >
                            ${contact.phone}
                            </p>
                        </div>
                    </div>
                    <a href="tel:${contact.phone}" class="p-2 bg-success-subtle rounded-3 align-self-baseline"><i class="fa-solid fa-phone text-success font-12"></i></a>
                </div>
    `;
    }
}

function DisplayEmergencyContacts() {
    document.getElementById("emergency-contacts").innerHTML = '';
    document.getElementById("countEmr").innerText = `${emergencyList.length}`;
    if (emergencyList.length === 0) {
        document.getElementById("emergency-contacts").innerHTML = `<p class="text-secondary text-center py-4">
                    No emergency contacts yet
                    </p>`;
    }
    for (var i = 0; i < emergencyList.length; i++) {
        var contact = emergencyList[i];
        document.getElementById("emergency-contacts").innerHTML += `<div class="d-flex justify-content-between px-3 py-3">

                    <div class="d-flex align-items-center mb-1 ">
                        <div class="me-3 rounded-3 bg-blue position-relative d-flex align-items-center justify-content-center " style="width: 2.5rem; height: 2.5rem;">
                    <div class="overflow-hidden rounded-3 w-100 h-100 d-flex align-items-center justify-content-center">${contact.image ? `<img src="${contact.image}" class="w-100 h-100 object-fit-cover" alt="${contact.firstName}">` : `<span class="text-white fw-bold" style="font-size: 1.5rem;">${contact.firstName.charAt(0).toUpperCase()}</span>`}</div>

                    </div>
                        <div>
                            <h6 class="card-title fw-bold mb-0">${contact.firstName}</h6>
                            <p class="card-text m-0" >
                            ${contact.phone}
                            </p>
                        </div>
                    </div>
                    <a href="tel:${contact.phone}" class="p-2 bg-success-subtle rounded-3 align-self-baseline"><i class="fa-solid fa-phone text-success font-12"></i></a>
                </div>`;
    }

}


function ClearForm() {
    document.getElementById("contactName").value = null;
    document.getElementById("contactPhone").value = null;
    document.getElementById("contactEmail").value = null;
    document.getElementById("contactAddress").value = null;
    document.getElementById("group").value = null;
    document.getElementById("notes").value = null;
    document.getElementById("contactPhoto").value = null;
    document.getElementById("btncheck1").checked = false;
    document.getElementById("btncheck2").checked = false;

    editingIndex = -1;

    
    document.getElementById("modalTitle").innerText = "Add New Contact";
}


function DeleteContact(index) {
    contactList.splice(index, 1);
    localStorage.setItem("contactList", JSON.stringify(contactList));

    favoriteList = contactList.filter(c => c.isFavorite);
    emergencyList = contactList.filter(c => c.isEmergency);

    localStorage.setItem("favoriteList", JSON.stringify(favoriteList));
    localStorage.setItem("emergencyList", JSON.stringify(emergencyList));

    DisplayContacts();
    DisplayFavorites();
    DisplayEmergencyContacts();
}

function AddFav(indexFav) {
    contactList[indexFav].isFavorite = !contactList[indexFav].isFavorite;
    localStorage.setItem("contactList", JSON.stringify(contactList));

    favoriteList = contactList.filter(c => c.isFavorite);
    localStorage.setItem("favoriteList", JSON.stringify(favoriteList));

    DisplayContacts();
    DisplayFavorites();
}

function AddEmr(indexEmr) {
    contactList[indexEmr].isEmergency = !contactList[indexEmr].isEmergency;
    localStorage.setItem("contactList", JSON.stringify(contactList));

    emergencyList = contactList.filter(c => c.isEmergency);
    localStorage.setItem("emergencyList", JSON.stringify(emergencyList));

    DisplayContacts();
    DisplayEmergencyContacts();
}


function EditContact(indexEdit) {
    var contact = contactList[indexEdit];
    document.getElementById("contactName").value = contact.firstName;
    document.getElementById("contactPhone").value = contact.phone;
    document.getElementById("contactEmail").value = contact.email;
    document.getElementById("contactAddress").value = contact.address;
    document.getElementById("group").value = contact.group;
    document.getElementById("notes").value = contact.notes;
    document.getElementById("btncheck1").checked = contact.isFavorite;
    document.getElementById("btncheck2").checked = contact.isEmergency;

    
    editingIndex = indexEdit;

    document.getElementById("modalTitle").innerText = "Edit Contact";

}


function Search() {
    var query = document.getElementById("searchInput").value.toLowerCase();
    var filteredContacts = contactList.filter(c =>
        c.firstName.toLowerCase().includes(query) ||
        c.phone.toLowerCase().includes(query) ||
        (c.email && c.email.toLowerCase().includes(query))
    );
    DisplayFilteredContacts(filteredContacts);
}


function DisplayFilteredContacts(filteredContacts) {
    document.getElementById("contacts").innerHTML = '';
    if (filteredContacts.length === 0) {
        document.getElementById("contacts").innerHTML = `<div id="temp-contacts"
                class="d-flex justify-content-center align-items-center flex-column align-content-between mt-5 pt-5"
            >
                <div
                class="bg-secondary-subtle text-secondary p-3 rounded-4 mb-3"
                >
                <i class="fa-solid fa-address-book fa-2x text-gray"></i>
                </div>
                <p class="text-secondary fw-bold">No contacts found</p>
                <p class="text-secondary fw-lighter">
                Try adjusting your search criteria
                </p>
            </div>`;
    }
    else {
        for (var i = 0; i < filteredContacts.length; i++) {
            var contact = filteredContacts[i];
            document.getElementById("contacts").innerHTML += `
        <div class="col-6">
            <div class="card rounded-4 shadow-sm border-0 h-100">
            <div class="card-body">
                <div class="d-flex align-items-center mb-1">
                    <div class="me-3 rounded-3 bg-blue position-relative d-flex align-items-center justify-content-center " style="width: 3rem; height: 3rem;">
                    <div class="overflow-hidden rounded-3 w-100 h-100 d-flex align-items-center justify-content-center">${contact.image ? `<img src="${contact.image}" class="w-100 h-100 object-fit-cover" alt="${contact.firstName}">` : `<span class="text-white fw-bold" style="font-size: 1.5rem;">${contact.firstName.charAt(0).toUpperCase()}</span>`}</div>

                    ${contact.isFavorite ? '<span class="position-absolute top-0 end-0 d-flex align-items-center justify-content-center" style="width: 1.5rem; height: 1.5rem; transform: translate(25%, -25%); background-color: #ffc107; border-radius: 50%; border: 2px solid white;"><i class="fa-solid fa-star text-white" style="font-size: 0.5rem;"></i></span>' : ''}
                    ${contact.isEmergency ? '<span class="position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center" style="width: 1.5rem; height: 1.5rem; transform: translate(25%, 25%); background-color: #dc3545; border-radius: 50%; border: 2px solid white;"><i class="fa-solid fa-heart-pulse text-white" style="font-size: 0.5rem;"></i></span>' : ''}
                </div>
                    <div>
                        <h5 class="card-title">${contact.firstName}</h5>
                        <p class="card-text" style="font-size: 0.75rem;"> <span class="p-1 bg-blue rounded-2" ><i class="fa-solid fa-phone text-blue" style="font-size: 0.5rem;"></i></span> ${contact.phone} </p>
                    </div>
                </div>
                <div class="d-flex gap-1 mt-3 flex-column">
                    ${contact.email ? `<p><span class="p-2 bg-purple-light rounded-3 me-2"><i class="fa-solid fa-envelope purple font-12"></i></span>${contact.email}</p>` : ''} 
                    ${contact.address ? `<p><span class="p-2 bg-success-subtle rounded-3 me-2"><i class="fa-solid fa-location-dot text-success font-12"></i></span>${contact.address} </p>` : ''}      
                    <div class="d-flex gap-1 me-2"> 
                        ${contact.group ? '<p class=" bg-orange-light badge rounded-3 m-0 text-orange">' + contact.group + '</p>' : ''}
                        ${contact.isEmergency ? '<p class="bg-red-light badge rounded-3 m-0 text-red"> <i class="fa-solid fa-heart-pulse"></i>Emergency </p>' : ''}
                    </div>
                </div>  
            </div>  
            <div class="card-footer bg-white border-gray rounded-bottom-4">
                <div class="d-flex justify-content-between align-items-center">  
                    <div class="d-fixed gap-1">
                        <a href="tel:${contact.phone}" class="p-2 bg-success-subtle rounded-3 "><i class="fa-solid fa-phone text-success font-12"></i></a>
                        ${contact.email ? `<a href="mailto:${contact.email}" class="p-2 bg-purple-light rounded-3 "><i class="fa-solid fa-envelope purple font-12"></i></a>` : ''} 
                    </div>
                    <div class="d-flex gap-1 text-secondary">
                        ${contact.isFavorite ? `<button onclick="AddFav(${i})" class="p-2 btn btn-outline-warning bg-warning-subtle  border-0"><i class="fa-solid fa-star text-warning"></i></button>` : `<button onclick="AddFav(${i})" class="p-2 btn btn-outline-secondary border-0 hover-btn-warning"><i class="fa-regular fa-star"></i></button>`}
                        ${contact.isEmergency ? `<button onclick="AddEmr(${i})" class="p-2 btn btn-outline-danger bg-danger-subtle border-0"><i class="fa-solid fa-heart-pulse text-danger"></i></button>` : `<button onclick="AddEmr(${i})" class="p-2  btn btn-outline-secondary border-0 hover-btn-danger"><i class="fa-regular fa-heart"></i></button>`}
                        <button onclick="EditContact(${i})" data-bs-toggle="modal"
                data-bs-target="#staticBackdrop" class="p-2 btn btn-outline-secondary border-0 hover-btn-info"><i class="fa-solid fa-pen"></i></button>
                        <button onclick="DeleteAlert(${i})" class="p-2 btn btn-outline-secondary border-0 hover-btn-danger"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>      
            </div>
        </div>
        `;
        }
    }
}



function DeleteAlert(indexDel) {
    Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
}).then((result) => {
    if (result.isConfirmed) {
    DeleteContact(indexDel);
    Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
    });
    }
});
}

function IsPhoneUnique(phone) {
    for(var i=0;i<contactList.length;i++){
        if(contactList[i].phone === phone && editingIndex !== i){
            return false;
        }
    }
    return true;
}