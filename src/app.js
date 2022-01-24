import { http } from './http';
import { ui } from './ui';


document.addEventListener('DOMContentLoaded', getPosts);

document.querySelector('.post-submit').addEventListener('click', submitPost);

document.querySelector('#posts').addEventListener('click',deletePost);

document.querySelector('#posts').addEventListener('click',enableEdit);

document.querySelector('.card-form').addEventListener('click',cancelEdit);

function getPosts() {
  http.get('http://localhost:3000/posts')
    .then(data => ui.showPosts(data))
    .catch(err => console.log(err));
}


function submitPost() {
  const title = document.querySelector('#title').value;
  const body = document.querySelector('#body').value;
  const id=document.querySelector('#id').value;

  const data = {
    title,
    body
  }


  if(title===''||body===''){
      ui.showAlert('please fill in all field before submitting','alert alert-danger');
  } 
  else{
      if (id==='')  // יוצר פוסט חדש  
        {        
            http.post('http://localhost:3000/posts', data)
            .then(data => {
            ui.showAlert('Post added', 'alert alert-success');
            ui.clearFields();
            getPosts();
            })
             .catch(err => console.log(err));
        }
       else { // משנה פוסט קיים       
        http.put(`http://localhost:3000/posts/${id}`, data)
        .then(data => {
        ui.showAlert('Post Updated', 'alert alert-success');
        ui.changeFormState('add');
        getPosts();
        })
         .catch(err => console.log(err));
      }
    }
}

function deletePost(e){
  if(e.target.parentElement.classList.contains('delete')){ // מחפש רק את היקון של מחיקה בעמצות לקרוא להורה
      const id=e.target.parentElement.dataset.id;
      if(confirm('are you sure')){
          http.delete(`http://localhost:3000/posts/${id}`)
          .then(data=>{
              ui.showAlert('post removesd','alert alert-success');
              getPosts();
          })
          .catch(err=>console.log(err));
      }
  }
}

function enableEdit(e){
    if(e.target.parentElement.classList.contains("edit")){
        const id=e.target.parentElement.dataset.id;
        const title=e.target.parentElement.previousElementSibling.previousElementSibling.textContent;
        const body=e.target.parentElement.previousElementSibling.textContent;

        const data={
            id,
            title,
            body
        }
        ui.fillForm(data);
    }
}
function cancelEdit(e){
    if(e.target.classList.contains('post-cancel')){
        ui.changeFormState('add');
    }
}