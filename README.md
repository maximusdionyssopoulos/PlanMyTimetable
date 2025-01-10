# PlanMyTimetable

A simple web app for easily creating timetables with drag-and-drop interactivity.

Please feel free to open an issue for issues or feature request.

## Features

- Drag and Drop classes
- Friend Timetable comparison
- Blocked/fixed times (for example, if you know that you always have work at 12:30 PM on Tuesdays, you may want to block out that time when creating your timetable)
- Browser Extension for easily capturing data from Allocate+.
- Dark mode

## Browser Extensions

You can install the browser extension for [Firefox](https://addons.mozilla.org/en-US/firefox/addon/planmytimetable-capture/) or [Chrome](https://chromewebstore.google.com/detail/planmytimetable-capture/copaeobjeemflpmmdlbllpoldganmdpa) (this includes Chromium based browser like Edge, Arc, Brave or Opera).

Unfortunately, a Safari browser extension is not available due to Apple's pricing policies. Instead you can use the [bookmark](https://planmytimetable.vercel.app/classes/add).

### University Support

Currently, the browser extension is only confirmed to work at:

- RMIT University
- Melbourne University.

I am currently working on adding support for Monash University. If your university uses Allocate+, please open an issue to request support.

## Privacy

All operations occur on-device with no data ever sent to a server.

## Help

### Issues and Changes

If you want to report a problem, or suggest an improvement or change, [please create an issue on Github.](https://github.com/maximusdionyssopoulos/PlanMyTimetable/issues/new/choose), and describe the problem or request.

### How to use

First add a class following the steps [on the add page](https://planmytimetable.vercel.app/classes/add), or [manually](https://planmytimetable.vercel.app/classes/add/manual).

Then drag the class for the sidebar into a preview slot on the calendar - these represent the available sessions for that class. You can move events from the calendar or sidebar to change the events place (time and day) on the calendar.

### Friend Timetable Comparison

Friend data is stored in local storage, meaning it persists across tabs and is retained everytime you visit PlanMyTimetable until it is removed.
A friend must create their timetable with PlanMyTimetable for the friend comparison features to work properly.

#### Add a friend

You can add a friend by clicking the "Add Friend" icon on the toolbar below the calendar and filling out the details in the modal.

#### Manage friends

You can remove friends individually or all at once by clicking the "Friends" button to show a popover. The popover allows users to remove friends by clicking the minus icon or users can hide and show friends using the checkbox.

#### Share your timetable

To share your timetable with a friend, use the share button on the toolbar below the calendar or copy the URL after you've created your timetable.

### Block (fixed) times

Blocked/fixed times are useful when planning around a fixed event in your calendar, such as a workday. Blocked times will hide preferences that overlap with that time, meaning you cannot place an event onto a time slot if it overlaps with a blocked event. To edit or delete a blocked time, click the inbox icon to view all your blocked times.

## Credits

- Tom Anderson ([andogq](https://github.com/andogq)) - Modified the bookmark code available [here](https://github.com/andogq/timetable), to select semester, use nanoid and JSONCrush, and redirect to this site. In addition, modified the timetable generator code to be compatible with the types used within this app.
