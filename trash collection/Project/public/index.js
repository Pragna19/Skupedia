

let newsAccordion = document.getElementById("accordion");
const xhr= new XMLHttpRequest();
xhr.open('GET','https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=7f52abfa4c77405896714db4190ddad8',true);
xhr.onload=function(){
    if(this.status===200){
       let json=JSON.parse(this.responseText)
       let articles = json.articles
       console.log(articles)
       let newshtml="";
       articles.forEach(function(element,index){

        
         let news =
         `<div class="card">
                   <div class="card-header" id="heading${index}">
                     <h5 class="mb-0">
                       <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapse${index}" aria-expanded="true" aria-controls="collapse${index}">
                      <b>News:${index+1}</b>              ${element["title"]}
                       </button>
                     </h5>
                   </div>
               
                   <div id="collapse${index}" class="collapse hide" aria-labelledby="heading${index}" data-parent="accordion">
                     <div class="card-body">
                      ${element['description']}. <a href="${element['url']}"target="_blank"> Read More </a>
                     </div>
                   </div>
                 </div>`
        
        newshtml+= news;

      })
       newsAccordion.innerHTML=newshtml;
    }
    else{
        console.log("Error")
    }
}

xhr.send()



