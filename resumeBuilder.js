//resumeBuilder.js
//Jesse Hoyt - jesselhoyt@gmail.com

//requires jquery
function buildPage(url){
	if(window.XMLHttpRequest){//most browsers
		//alert("xmlhttrequest") ;
		xhttp = new XMLHttpRequest() ;
	}
	else{//IE5/6
		//alert("activexobject") ;
		xhttp = new ActiveXObject("Microsoft.XMLHTTP") ;
	}
	xhttp.onreadystatechange = function(){

		//alert(xhttp.readyState + "  " + xhttp.status) ;
		if(xhttp.readyState == 4 && xhttp.status==200){
		
			//build page
			//alert("build page") ;
			xmlDoc = xhttp.responseXML ;
			
			if(xmlDoc == undefined) alert("error loading xml doc") ;
			
			//add stylsheets
			css = xmlDoc.getElementsByTagName("metadata")[0].getElementsByTagName("css") ;
			if(css != undefined){
				for(i = 0, len = css.length ; i < len ;  i++){
				
					$('head').append('<link rel="stylesheet" href="' + css[i].firstChild.nodeValue + '"/>') ;
				
				}
			}
			
			//change title of page 
			$("title").html( xmlDoc.getElementsByTagName("metadata")[0].getElementsByTagName("title")[0].childNodes[0].nodeValue) ;
		
			
		
			//add header
			$header = $('<div class="header"></div>') ;
			name = xmlDoc.getElementsByTagName("name")[0].childNodes[0].nodeValue ;
			$header.append($('<h1 class="name">' + name + '</h1>')) ;
			$dl = $('<dl></dl>') ;
			
			//if email addresses, add them to header
			emails = xmlDoc.getElementsByTagName("header")[0].getElementsByTagName("email") ;
			if(emails != undefined){
				$dl.append($('<dt>Email</dt>')) ;
				for(i = 0, len = emails.length ; i < len ; i++){
					email = emails[i].firstChild.nodeValue ;
					$dl.append($('<dd><a href="mailto:' + email + '">'+ email + '</a></dd>')) ;
				}
				
			}
			//if phone numbers, add them to header
			phones = xmlDoc.getElementsByTagName("header")[0].getElementsByTagName("phone") ;
			if(phones != undefined){
				$dl.append($('<dt>Phone</dt>')) ;
				
				for(i = 0, len = phones.length ; i < len ; i++){
					
					$dl.append($('<dd>' + phones[i].firstChild.nodeValue + '</dd>'));
				
				}
			
			}
			
			$header.append($dl) ;
			$('body').append($header) ;
			
			//details section
			$details = $('<div class="details"></div>');
			
			//skills subsection
			skillGroups = xmlDoc.getElementsByTagName("skill-group") ;
			if(skillGroups != undefined){//if skill-groups, add them to body
				$skills = $('<div class="skills"></div>');
				$skills.append($('<h3>Skills</h3>')) ;
				for(i = 0, len = skillGroups.length ; i < len ; i++){//each skill-group becomes a ul
					$skills.append($('<h6>' + skillGroups[i].attributes.getNamedItem("type").value + '</h6>'));
					$ul = $('<ul></ul>');
					skills = skillGroups[i].getElementsByTagName("skill") ;
					//alert(skills.length) ;
					for(j = 0, len2 = skills.length; j < len2 ; j++){
						$ul.append('<li>' + skills[j].firstChild.nodeValue + '</li>');
					
					}
					$skills.append($ul) ;
				}
				$details.append($skills) ;
				
				//education subsection
				schools = xmlDoc.getElementsByTagName("school") ;
				if(schools != undefined){
				
					$education = $('<div class="education"></div>') ;
					$education.append($('<h3>Education</h3>'));
				
					for(i = 0, len = schools.length ; i < len ; i++){
				
						$education.append($('<h4>' + schools[i].getElementsByTagName("name")[0].firstChild.nodeValue + '</h4>')) ;
						if(schools[i].getElementsByTagName("location").length > 0) $education.append($('<h5>' + schools[i].getElementsByTagName("location")[0].firstChild.nodeValue + '</h5>')) ;
						$education.append($('<h6>' + schools[i].getElementsByTagName("degree")[0].firstChild.nodeValue + '</h6>')) ;
						accomplishments = schools[i].getElementsByTagName("accomplishment") ;
						if(accomplishments != undefined){
							$ul = $('<ul></ul>') ;
							for(j = 0, len2 = accomplishments.length ; j < len2 ; j++){
								$ul.append('<li>' + accomplishments[j].firstChild.nodeValue + '</li>') ;
							}
							$education.append($ul) ;
						}
					}
					$details.append($education) ;
				}
				
				if(skillGroups != undefined && schools != undefined){//both sections there, add 'half' class
				
					$skills.addClass('half') ;
					$education.addClass('half') ;
				
				}
				$('body').append($details) ;
				
				//projects
				projects = xmlDoc.getElementsByTagName("project") ;
				if(projects != undefined){
					$projects = $('<div class="projects"></div>') ;
					$projects.append($('<h3>Projects</h3>'));
					$dl = $('<dl></dl>') ;
					for(i = 0, len = projects.length ; i < len ; i++){
						//alert(projects[i].getElementsByTagName("title")[0].firstChild.nodeValue) ;
						
						title = projects[i].getElementsByTagName("title")[0].firstChild.nodeValue ;
						//if link provided, make title a hyperlink
						if((link = projects[i].getElementsByTagName("link")[0].firstChild.nodeValue) != null){
							$dt = $('<dt><a href="' + link + '">' + title + '</a></dt>') ;
						}
						else{
							$dt = $('<dt>' + title + '</dt>') ;
						}
						$dl.append($dt) ;
						$dl.append($('<dd>' + projects[i].getElementsByTagName("description")[0].firstChild.nodeValue + '</dd>')) ;
					
					}
					$projects.append($dl) ;
					
				
				}
				$('body').append($projects) ;
				
				//experience
				experience = xmlDoc.getElementsByTagName("experience-item") ;
				if(experience != undefined){
					
					$experience = $('<div class="experience"></div>') ;
					$experience.append($('<h3>Experience</h3>')) ;
					
					//alert(experience.length) ;
					for(i = 0, len = experience.length ; i < len ; i++){
						
						$experience.append($('<h4>' + experience[i].getElementsByTagName("title")[0].firstChild.nodeValue + '</h4>')) ;
						$experience.append($('<h5>' + experience[i].getElementsByTagName("location")[0].firstChild.nodeValue + '</h5>')) ;
						$experience.append($('<h6>' + experience[i].getElementsByTagName("position")[0].firstChild.nodeValue + ', ' + experience[i].getElementsByTagName("time")[0].firstChild.nodeValue + '</h6>')) ;
						$experience.append($('<p>' + experience[i].getElementsByTagName("description")[0].firstChild.nodeValue + '</p>')) ;
					
					}
				$('body').append($experience) ;
				}
			}
		}
		else if(xhttp.readyState == 4 && xhttp.status != 200){
			window.location.href = "/resume.html" ;
		}
	}
	xhttp.open("GET", url, true) ;
	xhttp.send() ;
}		