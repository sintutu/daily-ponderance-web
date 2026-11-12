export type MeetingMessage = {
  id: string;
  html: string;
  text: string;
  displayHtml?: string;
};

export type MeetingSection = {
  id: string;
  title: string;
  messages: MeetingMessage[];
};

// Reviewed snapshot of the requested parts of the published scribe document.
export const meetingSections: MeetingSection[] = [
  {
    id: 'items-to-paste-in-chat',
    title: 'Direct Messages as Needed',
    messages: [
      {
        id: 'dm-video',
        html: 'Please turn off video when vaping or smoking. Thank you : )',
        text: 'Please turn off video when vaping or smoking. Thank you : )',
      },
      {
        id: 'dm-pdfs',
        html: 'Please do not share PDFs of the books <em>SSWG</em> or <em>The Daily Stoic</em> as it makes ASMM culpable of unauthorized distribution and copyright infringement.',
        text: 'Please do not share PDFs of the books SSWG or The Daily Stoic as it makes ASMM culpable of unauthorized distribution and copyright infringement.',
      },
      {
        id: 'dm-anonymous-display-name',
        html: 'Welcome, let me know if you would like your display name changed to an initial for anonymity.',
        text: 'Welcome, let me know if you would like your display name changed to an initial for anonymity.',
      },
      {
        id: 'dm-last-name',
        html: 'Welcome! Let us know if you’d like your last name changed to just an initial for anonymity.',
        text: 'Welcome! Let us know if you’d like your last name changed to just an initial for anonymity.',
      },
    ],
  },
  {
    id: 'before-meditation',
    title: 'Post Once Prior to Meditation',
    messages: [
      {
        id: 'pre-meeting-details',
        html: '<strong>ASMM: A Secular Meditation Meeting All Are Welcome!</strong><br>9am Pacific/12pm Eastern · DAILY<br>Meeting ID: 828 7388 3622<br>Passcode: 424242<br><br>To DM the host, a cohost (or others later in the meeting), click the box with the + icon and search by name.',
        text: 'ASMM: A Secular Meditation Meeting All Are Welcome!\n9am Pacific/12pm Eastern · DAILY\nMeeting ID: 828 7388 3622\nPasscode: 424242\n\nTo DM the host, a cohost (or others later in the meeting), click the box with the + icon and search by name.',
      },
      {
        id: 'pre-meeting-safety',
        html: 'The safety and security of our attendees is vital to our recovery. We encourage attendees to report to the ASMM hosts any inappropriate messages or other inappropriate behavior.<br><br><strong>PLEASE let a CO-HOST know</strong> if you receive a message which is inappropriate. Safety Chair for ASMM: Bradley B. @ 734-492-6501',
        text: 'The safety and security of our attendees is vital to our recovery. We encourage attendees to report to the ASMM hosts any inappropriate messages or other inappropriate behavior.\n\nPLEASE let a CO-HOST know if you receive a message which is inappropriate. Safety Chair for ASMM: Bradley B. @ 734-492-6501',
      },
    ],
  },
  {
    id: 'sharing',
    title: 'Beginning of Sharing Portion',
    messages: [
      {
        id: 'sharing-guidelines',
        html: 'Support by chat is encouraged, but please refrain from giving unsolicited advice during the meeting. Please stay after the meeting if you would like advice or to talk more in depth.<br><br><strong>PLEASE let a CO-HOST know</strong> if you receive a message which is inappropriate. Safety Chair for ASMM: Bradley B. @ 734-492-6501',
        text: 'Support by chat is encouraged, but please refrain from giving unsolicited advice during the meeting. Please stay after the meeting if you would like advice or to talk more in depth.\n\nPLEASE let a CO-HOST know if you receive a message which is inappropriate. Safety Chair for ASMM: Bradley B. @ 734-492-6501',
      },
      {
        id: 'group-conscience',
        html: 'The Group Conscience asks that shares be mindful of the open and inclusive spirit of our fellowship. May we share our experience, strength, and hope with a focus on the solution, as we support each other in recovery.<br><br>We can open breakout rooms at the close of the meeting for those who wish to talk about and find support related to other outside and partisan issues. Thank you for keeping our general meeting a safe and inclusive space for all!',
        text: 'The Group Conscience asks that shares be mindful of the open and inclusive spirit of our fellowship. May we share our experience, strength, and hope with a focus on the solution, as we support each other in recovery.\n\nWe can open breakout rooms at the close of the meeting for those who wish to talk about and find support related to other outside and partisan issues. Thank you for keeping our general meeting a safe and inclusive space for all!',
      },
    ],
  },
  {
    id: 'last-five',
    title: 'Last 5 Min',
    messages: [
      {
        id: 'burning-desire',
        html: 'Do you have a <strong>burning desire</strong>? A burning desire means you’re feeling at risk of drinking, using, or doing something that could harm your recovery or well-being. This time is for you to speak up and get support. You don’t have to face it alone.',
        text: 'Do you have a burning desire? A burning desire means you’re feeling at risk of drinking, using, or doing something that could harm your recovery or well-being. This time is for you to speak up and get support. You don’t have to face it alone.',
      },
    ],
  },
  {
    id: 'end',
    title: 'End',
    messages: [
      {
        id: 'attendance-verification',
        html: 'Click this link to request: <a href="https://secularmeditation.org/contact-us/forms-verification-of-attendance/">Verification of Attendance</a>',
        text: 'Click this link to request: Verification of Attendance (https://secularmeditation.org/contact-us/forms-verification-of-attendance/)',
        displayHtml: 'Click this link to request: <span class="message-link-text">Verification of Attendance</span>',
      },
      {
        id: 'website',
        html: 'Visit our website! <a href="https://secularmeditation.org/">https://secularmeditation.org/</a>',
        text: 'Visit our website! https://secularmeditation.org/',
        displayHtml: 'Visit our website! <span class="message-link-text">https://secularmeditation.org/</span>',
      },
      {
        id: 'join-again',
        html: '<strong>Join us again!</strong><br>ASMM: A Secular Meditation Meeting<br>9am Pacific/12pm Eastern DAILY<br>Meeting ID: 828 7388 3622<br>Passcode: 424242<br><br>Our mantra: Live and Let Live!<br><br>To save all the chat posts, click on the 3 dots at the bottom (or top) of the chat box and click “save chat”.',
        text: 'Join us again!\nASMM: A Secular Meditation Meeting\n9am Pacific/12pm Eastern DAILY\nMeeting ID: 828 7388 3622\nPasscode: 424242\n\nOur mantra: Live and Let Live!\n\nTo save all the chat posts, click on the 3 dots at the bottom (or top) of the chat box and click “save chat”.',
      },
      {
        id: 'crisis-resources',
        html: '<strong>CRISIS RESOURCES</strong><br>U.S. and Canada — Call or text 988<br>UK — CALM Helpline: 0800 58 58 58<br>International — <a href="https://findahelpline.com">findahelpline.com</a><br><br><strong>United States &amp; Territories</strong><br>911 — Emergency services (if someone is in immediate danger)<br>Veterans Crisis Line — Call 988, then press 1, or text 838255<br>LGBTQ+ Support (Trevor Project) — Call 1-866-488-7386 or text START to 678678<br>Crisis Text Line — Text HOME to 741741<br>The Samaritans / Lifeline — Call 1-800-273-8255 (still active alongside 988)',
        text: 'CRISIS RESOURCES\nU.S. and Canada — Call or text 988\nUK — CALM Helpline: 0800 58 58 58\nInternational — findahelpline.com (https://findahelpline.com)\n\nUnited States & Territories\n911 — Emergency services (if someone is in immediate danger)\nVeterans Crisis Line — Call 988, then press 1, or text 838255\nLGBTQ+ Support (Trevor Project) — Call 1-866-488-7386 or text START to 678678\nCrisis Text Line — Text HOME to 741741\nThe Samaritans / Lifeline — Call 1-800-273-8255 (still active alongside 988)',
        displayHtml: '<strong>CRISIS RESOURCES</strong><br>U.S. and Canada — Call or text 988<br>UK — CALM Helpline: 0800 58 58 58<br>International — <span class="message-link-text">findahelpline.com</span><br><br><strong>United States &amp; Territories</strong><br>911 — Emergency services (if someone is in immediate danger)<br>Veterans Crisis Line — Call 988, then press 1, or text 838255<br>LGBTQ+ Support (Trevor Project) — Call 1-866-488-7386 or text START to 678678<br>Crisis Text Line — Text HOME to 741741<br>The Samaritans / Lifeline — Call 1-800-273-8255 (still active alongside 988)',
      },
    ],
  },
];
