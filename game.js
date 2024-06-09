//初始化
var gamePattern = [];
var userClickedPattern = [];
var buttonColours = ["red", "blue", "green", "yellow"];
var level = 0;
$("#level2").hide();
$("#level6").hide();
$("#level6 svg").hide();
$("#idfail").hide();
$("#success").hide();
var slide = new Audio("./sounds/slide.mp3");
var wrong = new Audio("./sounds/wrong.mp3");
var idcheck = new Audio("./sounds/IDcorrect.mp3");

//系统发放sequence
var animating = false;
function nextSequence() {
  if (animating) {
    return;
  } else {
    animating = true;
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    $("#" + randomChosenColour)
      .fadeIn(100, playSound(randomChosenColour))
      .fadeOut(100)
      .fadeIn(100,function(){
        animating = false;
      });
    gamePattern.push(randomChosenColour);
  }
}

//用户回答
function handler() {
  var userChosenColour = this.getAttribute("id");
  playSound(userChosenColour);
  animatePress(userChosenColour);
  userClickedPattern.push(userChosenColour);
  checkAnswer(userClickedPattern.length - 1);
}

function playSound(name) {
  var audioLocation = "./sounds/" + name + ".mp3";
  var audio = new Audio(audioLocation);
  audio.play();
}

function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}

$("div[type=button]").on("click", handler);

//游戏开始
var started = false;
$(document).on("keydown", function () {
  if (started == false) {
    started = true;
    $("body").removeClass("game-over");
    level++;
    $("h1").text("Level " + level);
    $("#guide").fadeOut();
    $("#idfail").fadeOut();
    setTimeout(nextSequence, 1000);
  } else {
    return;
  }
});

//游戏中断后继续
function resume() {
  var win = new Audio("./sounds/win.mp3");
  win.play();
  $("h1").text("Level " + level);
  $("#level" + level).slideUp(500);
  userClickedPattern = [];
  setTimeout(nextSequence, 1500);
}

//游戏失败
function gameOver() {
  wrong.play();
  level = 0;
  userClickedPattern = [];
  gamePattern = [];
  started = false;
}

//level 16检查ID
$("#level6 form .initial").focus(function () {
  $("#level6 form .initial").val("");
  $("#level6 form .initial").removeClass("initial");
});

function checkID(event) {
  event.preventDefault();
  var correctAnswer = "simonschlepphoden";
  var userAnswer =
    $("#first").val().trim().toLowerCase() +
    $("#last").val().trim().toLowerCase();
  if (userAnswer == correctAnswer) {
    $("#level6  input[type='submit']").slideUp(500, function () {
      idcheck.play();
    });
    setTimeout(function () {
      $("#level6 svg").slideDown();
    }, 400);
    setTimeout(resume, 1500);
  } else {
    gameOver();
    $("body").addClass("game-over")
    $("#level6").slideUp(200);
    setTimeout(function(){
      $("#idfail").slideDown(200);
      $("h1").text("Press A Key to Restart");
    }, 210)  
  }
}

//升级时检查用户回答
function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] == gamePattern[currentLevel]) {
    if (currentLevel + 1 == level) {
      level++;
      if (level == 2) {
        slide.play();
        $("#level2").slideDown(1000);
        $("#level2 small").on("click", resume);
      } else if (level == 6) {
        slide.play();
        $("#level6").slideDown(1000);
        $("#level6 form").submit(checkID);
      } else if (level >= 50) {
        slide.play();
        $("#success").slideDown(1000);
        $("h1").text("Level " + level);
      } else {
        var win = new Audio("./sounds/win.mp3");
        win.play();
        $("h1").text("Level " + level);
        userClickedPattern = [];
        setTimeout(nextSequence, 1000);
      }
    } else {
    }
  } else {
    gameOver();
    $("h1").text("You Schlepphoden!!! Press A Key to Restart");
  }
}
