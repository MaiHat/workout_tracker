import React, { useState } from 'react'
import { useWorkouts } from "../contexts/workoutsContext";
import WorkoutList from "./WorkoutList";

export default function Calendar({ onClickDate, onHandleClickTodays, onChangeMonth }) {

  const { monthlyWorkoutDays, currentMonth,
    currentYear, setCurrentMonth, setCurrentYear, selectedDate, setSelectedDate} = useWorkouts();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", 
    "Aug", "Sep", "Oct", "Nov", "Dec" ];
  const today = new Date();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();//ex30
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();//0=Sunday, 1=Monday...
  

  function prevMonth() {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear));
    onChangeMonth();
  } 

  function nextMonth() {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear + 1 : prevYear));
    onChangeMonth();
  }

  function handleClickDate(dateNum) {
    const clickedDate = new Date(currentYear, currentMonth, dateNum);
    onClickDate(clickedDate);
    console.log("calendar clicked", clickedDate);
  }

  function handleClickTodays() {
    onHandleClickTodays(); 
  }
  
  return (
    <div>
      <div className='calendar-app'>
        <div className='calendar'>
          
              <div className='navigate-date'>
                <div className='buttons'>
                  <i className='bx bx-chevron-left' onClick={prevMonth}></i>
                </div>
                <h1 className='month'>{monthsOfYear[currentMonth]}</h1>
                <h1 className='year'>{currentYear}</h1>
                <div className='buttons'>
                  <i className='bx bx-chevron-right' onClick={nextMonth}></i>
                </div>
              </div>
              <div className='weekdays'>
               {daysOfWeek.map((day) => <span key={day}>{day}</span>)}
              </div>
              <div className='days'>
                {[...Array(firstDayOfMonth).keys()].map((_, index) => (
                 <span key={`empty-${index}`}/>
                ))}
                {/*Array(firstDayOfMonth) その月の1日の曜日に応じた空白を作る。もし月の初日が木曜日（4）なら空の <span> が4個作られる
                keys() で 0 から firstDayOfMonth - 1 までの数字列を作る　[0, 1, 2, 3]
                 .map() で空白 <span>
                span　key="empty-0"></span> <span key="empty-1"></span> <span key="empty-2"></span> <span key="empty-3"></span>
                */}
                {[...Array(daysInMonth).keys()].map((day) => {
                  const dateNumber = day + 1;
                  const isArchived = monthlyWorkoutDays.includes(dateNumber);
                  const isToday = 
                  dateNumber === today.getDate() &&
                  currentMonth === today.getMonth() &&
                  currentYear === today.getFullYear();
      
                  return (
                    <span
                      key={dateNumber}
                      className={`${isToday ? "current-day" : ""} ${isArchived ? "archived-day" : ""}`}
                      onClick={() => handleClickDate(dateNumber)}
                      >
                      {dateNumber}
                    </span>
                  );
                })
                } 
                { /* Array(daysInMonth).keys()
                        月の日数分（28〜31日）だけ数列を作る → 例: [0, 1, 2, ..., 30]（31日分）
                        .map((day) => <span key={day + 1}>    day は 0〜30（0始まり）なので、day + 1 が実際のカレンダー日
                        isTodayなら(今日の日付,月,年であれば) "current-day"のclassNameが<span>につく条件分岐
                        isArchivedなら "archived-day"のclassNameがつく
                          */}
              </div>
              <div className='archived-days'>
                  <h2>Monthy Archived <strong>{monthlyWorkoutDays.length}</strong>days</h2>
                  <button onClick={handleClickTodays}>Today's Training</button>
              </div>   
        </div>
      </div>
    </div>
  )
}
