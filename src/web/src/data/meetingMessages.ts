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
    id: 'between-shares',
    title: 'Between Shares',
    messages: [
      {
        id: 'explore-website',
        html: 'Explore our website! <a href="https://secularmeditation.org/">https://secularmeditation.org/</a>',
        text: 'Explore our website! https://secularmeditation.org/',
        displayHtml: 'Explore our website! <span class="message-link-text">https://secularmeditation.org/</span>',
      },
      {
        id: 'home-group-invitation',
        html: 'Not a member yet?<br><a href="https://secularmeditation.org/contact-us/forms-home-group-request/">Become an ASMM Home Group member</a>',
        text: 'Not a member yet?\nBecome an ASMM Home Group member (https://secularmeditation.org/contact-us/forms-home-group-request/)',
        displayHtml: 'Not a member yet?<br><span class="message-link-text">Become an ASMM Home Group member</span>',
      },
      {
        id: 'member-benefits',
        html: '<strong>ASMM Home Group Members Can:</strong><br><a href="https://secularmeditation.org/contact-us/forms-literature-request/">Request free literature</a><br><a href="https://secularmeditation.org/contact-us/forms-anniversary-coin-request/">Request a free Secular Anniversary Coin</a><br><a href="https://secularmeditation.org/members/whatsapp/">Join our WhatsApp Group</a><br><a href="https://secularmeditation.org/contact-us/forms-host-and-co-host-training/">Request Co-Host or Host Training</a>',
        text: 'ASMM Home Group Members Can:\nRequest free literature (https://secularmeditation.org/contact-us/forms-literature-request/)\nRequest a free Secular Anniversary Coin (https://secularmeditation.org/contact-us/forms-anniversary-coin-request/)\nJoin our WhatsApp Group (https://secularmeditation.org/members/whatsapp/)\nRequest Co-Host or Host Training (https://secularmeditation.org/contact-us/forms-host-and-co-host-training/)',
        displayHtml: '<strong>ASMM Home Group Members Can:</strong><br><span class="message-link-text">Request free literature</span><br><span class="message-link-text">Request a free Secular Anniversary Coin</span><br><span class="message-link-text">Join our WhatsApp Group</span><br><span class="message-link-text">Request Co-Host or Host Training</span>',
      },
      {
        id: 'seventh-tradition',
        html: '&ldquo;Every group ought to be fully self-supporting, declining outside contributions.&rdquo;<br>7th Tradition link: <a href="https://donate.homegroup.online/asmm/">ASMM’s Homegroup.Online Donation Page</a>',
        text: '“Every group ought to be fully self-supporting, declining outside contributions.”\n7th Tradition link: ASMM’s Homegroup.Online Donation Page (https://donate.homegroup.online/asmm/)',
        displayHtml: '&ldquo;Every group ought to be fully self-supporting, declining outside contributions.&rdquo;<br>7th Tradition link: <span class="message-link-text">ASMM’s Homegroup.Online Donation Page</span>',
      },
      {
        id: 'host-recruiting',
        html: '<strong>We currently need hosts!</strong><br>Please reach out if you are interested. Service keeps us sober!<br><a href="https://secularmeditation.org/contact-us/forms-host-and-co-host-training/">Request Co-Host or Host Training</a>',
        text: 'We currently need hosts!\nPlease reach out if you are interested. Service keeps us sober!\nRequest Co-Host or Host Training (https://secularmeditation.org/contact-us/forms-host-and-co-host-training/)',
        displayHtml: '<strong>We currently need hosts!</strong><br>Please reach out if you are interested. Service keeps us sober!<br><span class="message-link-text">Request Co-Host or Host Training</span>',
      },
      {
        id: 'assistant-treasurer',
        html: 'ASMM is also looking for an <strong>Assistant Treasurer</strong> as soon as possible. If you are interested in this (1 year) service position, please email: <a href="mailto:secularmeditation.aa@gmail.com">secularmeditation.aa@gmail.com</a><br><br>Requirements: 1 year continuous sobriety, be an ASMM home group member, volunteer for the position, and be confirmed by vote at a Group Conscience Meeting.',
        text: 'ASMM is also looking for an Assistant Treasurer as soon as possible. If you are interested in this (1 year) service position, please email: secularmeditation.aa@gmail.com (mailto:secularmeditation.aa@gmail.com)\n\nRequirements: 1 year continuous sobriety, be an ASMM home group member, volunteer for the position, and be confirmed by vote at a Group Conscience Meeting.',
        displayHtml: 'ASMM is also looking for an <strong>Assistant Treasurer</strong> as soon as possible. If you are interested in this (1 year) service position, please email: <span class="message-link-text">secularmeditation.aa@gmail.com</span><br><br>Requirements: 1 year continuous sobriety, be an ASMM home group member, volunteer for the position, and be confirmed by vote at a Group Conscience Meeting.',
      },
      {
        id: 'more-secular-meetings',
        html: 'Once a day not enough? Looking for more Secular AA meetings? You’re in luck, there’s a whole bunch of ’em!<br><a href="https://www.worldwidesecularmeetings.com/meetings">https://www.worldwidesecularmeetings.com/meetings</a>',
        text: 'Once a day not enough? Looking for more Secular AA meetings? You’re in luck, there’s a whole bunch of ’em!\nhttps://www.worldwidesecularmeetings.com/meetings',
        displayHtml: 'Once a day not enough? Looking for more Secular AA meetings? You’re in luck, there’s a whole bunch of ’em!<br><span class="message-link-text">https://www.worldwidesecularmeetings.com/meetings</span>',
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
