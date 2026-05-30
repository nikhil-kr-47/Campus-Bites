// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })();

  let orderTypeDiv=document.querySelector(".order-type-div");
  let deliveryMode=document.querySelector("#deliveryMode");
  if(deliveryMode){
  deliveryMode.addEventListener("change",()=>{
    if(deliveryMode.value==="hostel") orderTypeDiv.style.display="none";
    else orderTypeDiv.style.display="block";
  });
}

  let slotSelectDiv=document.querySelector(".slot-select-div");
  let orderType=document.querySelector("#orderType");
  let slotOption=document.querySelector("#slot");
  if(orderType){
  if(orderType.value==="queue") slotOption.disabled=true;
  
  orderType.addEventListener("change",()=>{
    if(orderType.value==="slot") {
     
      slotOption.disabled=false;
      slotSelectDiv.style.display="block";
    }
    else {
      slotSelectDiv.style.display="none";
      slotOption.disabled=true;
    }
  });
}

let hostelOrderBtn=document.querySelector("#show-hostel-orders");
let queueOrderBtn=document.querySelector("#show-queue-orders");
let slotOrderBtn=document.querySelector("#show-slot-orders");
let hostelOrderTable=document.querySelector(".hostel-order-table");
let queueOrderTable=document.querySelector(".queue-order-table");
let slotOrderTable=document.querySelector(".slot-order-table");

function showTable(table){
  hostelOrderTable.style.display="none";
  queueOrderTable.style.display="none";
  slotOrderTable.style.display="none";
  table.style.display="table";
}

if(hostelOrderBtn){
hostelOrderBtn.addEventListener("click",()=>{
  showTable(hostelOrderTable);
});
}

if(queueOrderBtn){
queueOrderBtn.addEventListener("click",()=>{
  showTable(queueOrderTable);
});
}

if(slotOrderBtn){
slotOrderBtn.addEventListener("click",()=>{
  showTable(slotOrderTable);
});
}

let newPassword=document.querySelector("#new-pass");
let confirmNewPassword=document.querySelector("#confirm-new-pass");
let passwordResetBtn=document.querySelector("#reset-password-btn");
if(confirmNewPassword){
confirmNewPassword.addEventListener("input",()=>{
  if(newPassword && newPassword.value===confirmNewPassword.value) passwordResetBtn.disabled=false;
  else passwordResetBtn=true;
});
}



