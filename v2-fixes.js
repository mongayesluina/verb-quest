const verbQuestHome=home;
home=function(){
  if(typeof speedTimer!=='undefined'&&speedTimer){clearInterval(speedTimer);speedTimer=null;}
  verbQuestHome();
};
