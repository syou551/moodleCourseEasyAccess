// ==UserScript==
 // @name         Moodle Course Easy Access
 // @namespace    http://tampermonkey.net/
 // @version      0.1
 // @description  try to take over the world!
 // @author       Syou
 // @match        https://moodle.cis.kit.ac.jp/*
 // @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
 // @grant        none
 // ==/UserScript==

 (function () {
   'use strict';

   const COURSE_STORAGE_KEY = 'hidden_course1';
   const COURSENAME_STORAGE_KEY = 'hidden_course2';
   let first = 0;

   window.setTimeout(hiddenCourseSelector,3000);
   hideSidebarCourse();

   function getHiddenCourse() {
     const hiddenCourse = localStorage.getItem(COURSE_STORAGE_KEY);
     if (
       hiddenCourse === null ||
       hiddenCourse === undefined ||
       hiddenCourse === ''
     ) {
       return [];
     }

     return hiddenCourse.split(',');
   }

   function resetCourseList(){
     localStorage.clear(COURSE_STORAGE_KEY);
     localStorage.clear(COURSENAME_STORAGE_KEY);
     return;
   }

   function toggleCourse(course,name) {
     const list = getHiddenCourse();
     const listName = getHiddenCourseName();
     if (!list.includes(course)) {
       list.push(course);
       listName.push(name);
     } else {
       list.splice(list.indexOf(course), 1);
       listName.splice(listName.indexOf(name), 1);
     }
     localStorage.setItem(COURSE_STORAGE_KEY, list.join(','));
     localStorage.setItem(COURSENAME_STORAGE_KEY, listName.join(','));
   }

   function getHiddenCourseName() {
     const hiddenCourseName = localStorage.getItem(COURSENAME_STORAGE_KEY);
     if (
       hiddenCourseName === null ||
       hiddenCourseName === undefined ||
       hiddenCourseName === ''
     ) {
       return [];
     }

     return hiddenCourseName.split(',');
   }

   function checkCourse(){
     if (!location.href.endsWith('/my/courses.php')) return;

     const hiddenCourse = getHiddenCourse();

     const courseListElem = document.getElementById('page-container-2');
     if (!courseListElem) return;

     const courseListElem2 = courseListElem.childNodes[1];
     const courseListElem3 = courseListElem2.childNodes[1];

     for (const title of courseListElem3
       .children) {
       const div = title.childNodes[3].childNodes[1].childNodes[1];
       const link = div.querySelector('a');
       if (!link) continue;

       const linkHref = link.getAttribute('href');
       const courseId = linkHref.match(/\?id=(\d+)/)[1];
       const courseName = link.childNodes[5].innerText;
       if (!courseId) continue;
       toggleCourse(courseId,courseName);
     }

   }

   function hiddenCourseSelector() {
     if (!location.href.endsWith('/my/courses.php')) return;

     const hiddenCourse = getHiddenCourse();

     let courseListElem = document.getElementById('page-container-2');
     if (!courseListElem){
       courseListElem = document.getElementById('page-container-1');
       if(!courseListElem) return;
     }

     const courseListElem2 = courseListElem.childNodes[1];
     const courseListElem3 = courseListElem2.childNodes[1];

     for (const title of courseListElem3
       .children) {
       const div = title.childNodes[3].childNodes[1].childNodes[1];
       const link = div.querySelector('a');
       if (!link) continue;

       const linkHref = link.getAttribute('href');
       const courseId = linkHref.match(/\?id=(\d+)/)[1];
       const courseName = link.childNodes[5].innerText.split("\n");
       if (!courseId) continue;

       let button = document.getElementById(courseId);
       if (!button) {
         button = document.createElement('button');
         button.addEventListener('click', () => {
           toggleCourse(courseId,courseName[0]);
           hiddenCourseSelector();
         });
         button.id = courseId;
         title.childNodes[5].appendChild(button);
       }

       const hidden = hiddenCourse.includes(courseId);
       button.textContent = hidden ? '非表示する': '表示する' ;
       button.className = hidden ? 'btn-primary' : '';
       link.style.color = hidden ? '#0070a8' : '#c2c2c2' ;
     }
   }

   function hideSidebarCourse() {
     const sideBar = document.getElementById('inst372568');
     if(!sideBar) return;
     const div = sideBar.childNodes[1];

     const listId = getHiddenCourse();
     let i = 0;
     const listName = getHiddenCourseName();

     const tab = document.createElement('ul');

     for(const id of listId){
       const li = document.createElement('li');
       let course = document.createElement('a');
       course.href = 'https://moodle.cis.kit.ac.jp/course/view.php?id=' + id;
       course.innerText = listName[i];
       li.appendChild(course);
       tab.appendChild(li);
       i++;
     }
     const reset = document.createElement(button);
     reset.textContent = '表示する科目をリセット';
     reset.addEventListener('click', () => {resetCourseList();location.reload();});
     div.appendChild(tab);
     div.appendChild(reset);
   }

 })();
