const menu=document.querySelector('#menu');
const nav=document.querySelector('#nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
const form=document.querySelector('#trip-booking-form');
const detailsStep=document.querySelector('#details-step');
const paymentStep=document.querySelector('#payment-step');
const summary=document.querySelector('#booking-summary');
const container=document.querySelector('#razorpay-container');
const loadStatus=document.querySelector('#payment-load-status');
const retry=document.querySelector('#retry-payment');
let paymentObserver;
let paymentTimeout;
function clearPayment(){
 if(paymentObserver)paymentObserver.disconnect();
 clearTimeout(paymentTimeout);
 container.replaceChildren();
 retry.hidden=true;
}
function loadPaymentButton(){
 clearPayment();
 loadStatus.hidden=false;
 loadStatus.textContent='Loading Razorpay payment button…';
 const script=document.createElement('script');
 script.src='https://checkout.razorpay.com/v1/payment-button.js';
 script.dataset.payment_button_id='pl_TowWj55JEUAbaC';
 script.async=true;
 function failed(){
  if(paymentObserver)paymentObserver.disconnect();
  clearTimeout(paymentTimeout);
  loadStatus.hidden=false;
  loadStatus.textContent='The Razorpay button could not load. Retry, or contact our team before paying.';
  retry.hidden=false;
 }
 paymentObserver=new MutationObserver(()=>{
  if(container.querySelector('button, iframe, .razorpay-payment-button')){
   loadStatus.hidden=true;
   retry.hidden=true;
   clearTimeout(paymentTimeout);
   paymentObserver.disconnect();
  }
 });
 paymentObserver.observe(container,{childList:true,subtree:true});
 script.addEventListener('error',failed);
 paymentTimeout=setTimeout(failed,15000);
 container.append(script);
}
function validateFields(){
 for(const field of form.querySelectorAll('input[type="text"], input:not([type]), input[type="tel"], input[type="email"]')){
  field.value=field.value.trim();
 }
 const phone=form.elements.phone;
 const digits=phone.value.replace(/\D/g,'');
 phone.setCustomValidity(/^[+0-9() .-]+$/.test(phone.value)&&digits.length>=8&&digits.length<=15?'':'Enter a valid phone number with 8–15 digits.');
 return form.reportValidity();
}
form.addEventListener('input',event=>{if(typeof event.target.setCustomValidity==='function')event.target.setCustomValidity('')});
form.addEventListener('submit',event=>{
 event.preventDefault();
 if(!validateFields())return;
 const data=Object.fromEntries(new FormData(form).entries());
 const labels={name:'Name',phone:'Phone',email:'Email',destination:'Trip',group_size:'Group size',travel_date:'Travel date',message:'Notes'};
 summary.replaceChildren();
 for(const [key,label] of Object.entries(labels)){
  if(!data[key])continue;
  const row=document.createElement('div');row.className='summary-row';
  const term=document.createElement('dt');term.textContent=label;
  const value=document.createElement('dd');value.textContent=data[key];
  row.append(term,value);summary.append(row);
 }
 const enquiry='Hi Core Memories Club! I would like to enquire about a trip.\n\n'+Object.entries(labels).filter(([key])=>data[key]).map(([key,label])=>label+': '+data[key]).join('\n')+'\n\nPlease confirm availability, the final quote and payment amount.';
 document.querySelector('#send-enquiry').href='https://wa.me/918826526252?text='+encodeURIComponent(enquiry);
 detailsStep.hidden=true;
 paymentStep.hidden=false;
 document.querySelector('#payment-title').focus();
 loadPaymentButton();
});
document.querySelector('#edit-booking').addEventListener('click',()=>{
 clearPayment();
 paymentStep.hidden=true;
 detailsStep.hidden=false;
 document.querySelector('#full-name').focus();
});
retry.addEventListener('click',loadPaymentButton);
const requestedTrip=new URLSearchParams(window.location.search).get('trip');
const destination=document.querySelector('#booking-destination');
if(Array.from(destination.options).some(option=>option.value===requestedTrip))destination.value=requestedTrip;
