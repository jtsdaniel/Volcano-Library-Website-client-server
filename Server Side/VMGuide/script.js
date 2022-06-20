const quotes = [
  "Today you are you! That is truer than true! There is no one alive who is you-er than you!",
  "Don't cry because it's over. Smile because it happened.",
  "You have brains in your head. You have feet in your shoes. You can steer yourself in any direction you choose. You're on your own, and you know what you know. And you are the guy who'll decide where to go.",
  "I like nonsense, it wakes up the brain cells. Fantasy is a necessary ingredient in living, it's a way of looking at life through the wrong end of a telescope. Which is what I do, and that enables you to laugh at life's realities.",
  "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
  "Step with care and great tact, and remember that Life's a Great Balancing Act.",
  "Think left and think right and think low and think high. Oh, the thinks you can think up if only you try!",
  "How did it get so late so soon? Its night before its afternoon. December is here before its June. My goodness how the time has flewn. How did it get so late so soon?",
  "Only you can control your future."
];

const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
document.querySelector(".quote").textContent = randomQuote;
