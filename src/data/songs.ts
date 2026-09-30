import type { Song } from "./types";

const illustratedCovers = [
  "/memories/moon.svg",
  "/memories/night.svg",
  "/memories/sunset.svg",
] as const;

const coverFor = (number: number) =>
  illustratedCovers[(number - 1) % illustratedCovers.length]!;

export const playlistDedication =
  "You have the purest parts of my heart, and in every universe, I am always in love with you.";

export const songs: Song[] = [
  {
    id: "eternally-yours", number: 1, title: "Eternally Yours", artist: "Motionless In White", cover: coverFor(1),
    spotifyUri: "spotify:track:11EVeW30HHEMZZsWgWzdfN",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0220bfa6114be3fcada3b5b3e3",
    note: [
      { text: "Just like the lyrics say, " },
      { text: "“in the name of love, I’m ready to bury all of my bones.”", style: "lyric" },
      { text: " That’s how deeply I love you—the kind of love where I’d give every part of myself just to love you for as long as I exist." },
    ],
  },
  {
    id: "the-world-is-ugly", number: 2, title: "The World Is Ugly", artist: "My Chemical Romance", cover: coverFor(2),
    spotifyUri: "spotify:track:6VtcgrVYo2xfygcWAfRpd1",
    artworkUrl: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02a67cf0d53d5f2170077e8ef5",
    note: [
      { text: "“The world is ugly, but you’re beautiful to me.”", style: "lyric" },
      { text: " No matter how messy or heavy life gets, " },
      { text: "you’ll always be the beautiful part of it.", style: "emphasis" },
    ],
  },
  {
    id: "until-the-day-i-die", number: 3, title: "Until the Day I Die", artist: "Story Of The Year", cover: coverFor(3),
    spotifyUri: "spotify:track:0DKNNR9iDjwfCEpMiFXMJq",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e021fe57c82dec10d3dcc87a2c6",
    note: [
      { text: "“Until the day I die, I’d spill my heart for you.”", style: "lyric" },
      { text: " Because loving you means " },
      { text: "giving you my heart completely.", style: "emphasis" },
    ],
  },
  {
    id: "all-my-heart", number: 4, title: "All My Heart", artist: "Sleeping With Sirens", cover: coverFor(4),
    spotifyUri: "spotify:track:5ANZkftsPAO0yhynm9jwlU",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02800934f8144df91dae16b6e4",
    note: [
      { text: "Through every version of us, every mistake, and every year that passes, I hope you always know that " },
      { text: "my heart is still completely yours.", style: "emphasis" },
    ],
  },
  {
    id: "your-call", number: 5, title: "Your Call", artist: "Secondhand Serenade", cover: coverFor(5),
    spotifyUri: "spotify:track:7ddJJFmXZ3984IbVEKinp5",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02d307631517c126fa36f7f785",
    note: [
      { text: "Sometimes I just want " },
      { text: "your name to pop up on my screen", style: "emphasis" },
      { text: " so I can hear your voice and bother you for the next several hours. I don’t think you’ll ever understand how much something as simple as " },
      { text: "a call from you can change my whole mood.", style: "emphasis" },
    ],
  },
  {
    id: "ohio-is-for-lovers", number: 6, title: "Ohio Is For Lovers", artist: "Hawthorne Heights", cover: coverFor(6),
    spotifyUri: "spotify:track:23DHUWJ7iEieNPMPKvjzBV",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02b4b59e1dd1a9c0fa4dc27c61",
    note: [
      { text: "“My heart is in Ohio”", style: "lyric" },
      { text: "—but mine is in " },
      { text: "Colorado", style: "strong-emphasis" },
      { text: ", because that’s where you are." },
    ],
  },
  {
    id: "i-dont-care-if-youre-contagious", number: 7, title: "I Don't Care If You're Contagious", artist: "Pierce The Veil", cover: coverFor(7),
    spotifyUri: "spotify:track:5z4GWgru4a3X0SFnQMD2oH",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e025eae69bbe37d5f382155e387",
    note: [
      { text: "You know how special this song has always been to me. I remember listening to it and thinking, " },
      { text: "I wanna be loved like this someday", style: "emphasis", italic: true },
      { text: "—deeply, fearlessly, and a little insanely. " },
      { text: "“I don’t care if you’re sick, I don’t care if you’re contagious, I would kiss you even if you are dead.”", style: "lyric" },
      { text: " And now when I hear it, I think of " },
      { text: "you and the kind of love I’ve always wanted.", style: "emphasis" },
    ],
  },
  {
    id: "the-bomb-dot-com-v2-0", number: 8, title: "The Bomb Dot Com V2.0", artist: "Sleeping With Sirens", cover: coverFor(8),
    spotifyUri: "spotify:track:6WBkSZbGBaIWnEgnMoXEJU",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02032fd22bde573d0746c87352",
    note: [
      { text: "“It’s all for the sake of love, it’s all for you.”", style: "lyric" },
      { text: " Through every scar, every hard day, and everything we go through, " },
      { text: "my heart will still choose you.", style: "emphasis" },
      { text: " And if loving you means giving you every piece of me, then baby, " },
      { text: "you can have it all.", style: "emphasis" },
    ],
  },
  {
    id: "wonderless", number: 9, title: "Wonderless", artist: "Pierce The Veil", cover: coverFor(9),
    spotifyUri: "spotify:track:4QCczE24wLpDmPJ3qwwEvC",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02d2d0137c32938ae8cb44e0ca",
    note: [
      { text: "Wonderless", style: "reference" },
      { text: " feels like loving someone even when you’re lost in your own head, when everything feels messy and uncertain. " },
      { text: "Even when I lose myself, my heart still knows its way back to you.", style: "emphasis" },
    ],
  },
  {
    id: "for-her", number: 10, title: "for her", artist: "whatsaheart", cover: coverFor(10),
    spotifyUri: "spotify:track:7iwDR2NBmjqbUGWnFNVEYp",
    artworkUrl: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02685054f0b4d15509cb8aa246",
    note: [
      { text: "You’re somehow " },
      { text: "always in the back of my mind", style: "emphasis" },
      { text: ", even in the most ordinary moments. I could be doing absolutely nothing and still find myself missing you, wishing you were here, and " },
      { text: "loving you a little more than I did yesterday.", style: "emphasis" },
    ],
  },
  {
    id: "scene-one-james-dean-and-audrey-hepburn", number: 11, title: "Scene One - James Dean & Audrey Hepburn", artist: "Sleeping With Sirens", cover: coverFor(11),
    spotifyUri: "spotify:track:1WH0HcFJhu5r6Jxqdsh54N",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02de5a8550905395c2d8f7a410",
    note: `i think what gets me about this song is wanting someone to stay and wondering if maybe you've finally found something worth holding onto. i don't need some perfect movie love story with you. i just want our story, however messy or ordinary it gets, as long as i still get to have you in it.`,
  },
  {
    id: "thunder", number: 12, title: "Thunder", artist: "BOYS LIKE GIRLS", cover: coverFor(12),
    spotifyUri: "spotify:track:00fivIbneerD9okPhdQ8wn",
    artworkUrl: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e028d83bb452f5600306d4a012a",
    note: `i want to remember this version of us forever. the late-night calls, the stupid jokes, missing each other, laughing until one of us can't breathe, and all the tiny things that probably don't seem important right now. someday these are going to be memories, and i hope i never forget how it felt to be this young and this in love with you.`,
  },
  {
    id: "my-heroine-acoustic", number: 13, title: "My Heroine - Acoustic", artist: "Silverstein", cover: coverFor(13),
    spotifyUri: "spotify:track:3n52npc7FPjG4dBZcgLjmD",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02949970ad46926e649b78b492",
    note: `this song is dark as fuck, so no, i'm not calling our relationship an addiction. i just love how intensely it captures what it's like when one person can get so deeply into your head that you can't ignore what you feel anymore. you definitely live in mine rent free.`,
  },
  {
    id: "all-i-wanted", number: 14, title: "All I Wanted", artist: "Paramore", cover: coverFor(14),
    spotifyUri: "spotify:track:1Bv3h7Vc4AaYA2BcSM3rVd",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02e01d7d558032457b0e4883f6",
    note: `sometimes love really is embarrassingly simple. out of everything i could ask for, there are moments when all i actually want is you. your attention, your voice, your time, your stupid face. that's it.`,
  },
  {
    id: "never-let-this-go", number: 15, title: "Never Let This Go", artist: "Paramore", cover: coverFor(15),
    spotifyUri: "spotify:track:2itu79WbZhUCHX4jg0fyAd",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e025cab62839794c2cc3d6a135b",
    note: `this one isn't exactly a happy love song, but i understand the feeling of caring so much and still struggling to find the right words sometimes. i never want silence, distance, or one bad moment to make us forget how much we actually mean to each other.`,
  },
  {
    id: "jet-lag-feat-natasha-bedingfield", number: 16, title: "Jet Lag (feat. Natasha Bedingfield)", artist: "Simple Plan", cover: coverFor(16),
    spotifyUri: "spotify:track:0I329vpTJRdSRjEcWaQsSL",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02de7ba7b8ecfb253e4550f357",
    note: `this might be one of the most us songs in this entire playlist. different places, different clocks, missing each other at completely inconvenient times, and still trying to make it work anyway. long distance is so fucking annoying, baby. but you're worth every stupid time difference.`,
  },
  {
    id: "drown", number: 17, title: "Drown", artist: "Bring Me The Horizon", cover: coverFor(17),
    spotifyUri: "spotify:track:6o39Ln9118FKTMbM4BvcEy",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0290b88187a9831d91f2438927",
    note: `i don't love this song because i want you to save me from everything. i love the feeling underneath it, that desperate need to have someone reach for you when your own head gets too loud. i hope you always know you can reach for me too.`,
  },
  {
    id: "you-be-the-anchor", number: 18, title: "You Be The Anchor That Keeps My Feet on the Ground, I'll Be the Wings That Keep Your Heart in the Clouds", artist: "Mayday Parade", cover: coverFor(18),
    spotifyUri: "spotify:track:5B7xzzpqgWY6sdiebvEVJA",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02f7a58da348455480bf248fd5",
    note: `first of all, this title is ridiculous. second, i love it. i want us to be that for each other. someone who keeps the other grounded when life gets messy, but also someone who makes life feel bigger, softer, and more exciting.`,
  },
  {
    id: "my-heart", number: 19, title: "My Heart", artist: "Paramore", cover: coverFor(19),
    spotifyUri: "spotify:track:5wWkbQ18TPaWq2GeJDF2O3",
    artworkUrl: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e025cab62839794c2cc3d6a135b",
    note: `this one feels so simple to me. my heart is yours. i don't know how else to explain something that feels this big without making it complicated. i love you with everything i have in me, and if you ever wonder where my heart is, it's with you.`,
  },
  {
    id: "the-only-exception", number: 20, title: "The Only Exception", artist: "Paramore", cover: coverFor(20),
    spotifyUri: "spotify:track:7JIuqL4ZqkpfGKQhYlrirs",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02e01d7d558032457b0e4883f6",
    note: `letting someone matter this much is scary because it means they have the ability to hurt you too. but somehow you make me want to take that risk anyway. i'd rather be vulnerable with you than protect myself so much that i never get to love you properly.`,
  },
  {
    id: "my-heart-live-at-the-congress-theater", number: 21, title: "My Heart - Live at the Congress Theater", artist: "Paramore", cover: coverFor(21),
    spotifyUri: "spotify:track:2Tccmnebj8vB0hlsfcT4ip",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02324703581490af417fd865f6",
    note: `yes, the same song is here twice. no, i will not be taking questions. apparently giving you my heart once wasn't dramatic enough, so now you get the live version too.`,
  },
  {
    id: "entombed", number: 22, title: "Entombed", artist: "Deftones", cover: coverFor(22),
    spotifyUri: "spotify:track:4bLCPfBLKlqiONo6TALTh5",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0273652b7a0dc388dd1d044b69",
    note: `this song feels like being completely wrapped up in someone. like the rest of the world goes quiet for a little while and all you want is to stay close to them. that's what i want with you. those moments where nothing else matters because i'm exactly where i want to be, right next to you.`,
  },
  {
    id: "demolition-lovers", number: 23, title: "Demolition Lovers", artist: "My Chemical Romance", cover: coverFor(23),
    spotifyUri: "spotify:track:16Fp67kTFhH0XK5Cl6Oz7r",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e022e55bc288d7e0888027e22b7",
    note: `there's something so beautiful and tragic about loving someone with that "you and me until the end" kind of devotion. obviously, i don't want our story to end like theirs. i want the opposite. i want us to survive everything, grow old, and still be choosing each other after all of it. you and me against the world, except we actually get our happy ending.`,
  },
  {
    id: "emergency-contact", number: 24, title: "Emergency Contact", artist: "Pierce The Veil", cover: coverFor(24),
    spotifyUri: "spotify:track:4amltxLIfFmtYEvZbdgDqO",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e022846907b5152fb7dc38e450a",
    note: `you're my emergency contact. not just literally someday, but in every way that matters. when something happens, whether it's good, bad, scary, exciting, or completely stupid, you're one of the first people i want to reach for. i want you to be my person when life happens.`,
  },
  {
    id: "million-dollar-houses-the-painter", number: 25, title: "Million Dollar Houses (The Painter)", artist: "Pierce The Veil", cover: coverFor(25),
    spotifyUri: "spotify:track:0iWCpaSaiIZVPSqjZ9YB5L",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e025eae69bbe37d5f382155e387",
    note: `i always think about that question in this song: what if i'm just a painter? would you ever leave me for somebody who deserves you more? because i don't care how much or how little i have, i'd still want to build everything i can for you. i'll make that million dollars if i have to, because nobody could steal you from me. no, i don't think so.`,
  },
  {
    id: "kissing-in-cars-bonus-track", number: 26, title: "Kissing in Cars (Bonus Track)", artist: "Pierce The Veil", cover: coverFor(26),
    spotifyUri: "spotify:track:21n769QrJtrmN0pXuBkYOm",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e023c8674afa47336f571b13ebd",
    note: `there's something about this song that feels like being young, stupid, and completely in love. the kind where even something as simple as sitting in a car and kissing the person you love becomes a memory you never want to lose. i want those little moments with you. the ones that don't look important to anyone else but mean everything to us.`,
  },
  {
    id: "your-nickel-aint-worth-my-dime", number: 27, title: "Your Nickel Ain't Worth My Dime", artist: "Sleeping With Sirens", cover: coverFor(27),
    spotifyUri: "spotify:track:1ZJwYEoiXeY4XaIOpbQYh4",
    artworkUrl: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02800934f8144df91dae16b6e4",
    note: `i mostly put this energy toward the idea that if i have you, i don't really care about whatever else is supposed to impress me. you're already my favorite thing to come home to, even if right now "home" is usually just a call with you.`,
  },
  {
    id: "wherever-you-will-go", number: 28, title: "Wherever You Will Go", artist: "The Calling", cover: coverFor(28),
    spotifyUri: "spotify:track:5QpaGzWp0hwB5faV8dkbAz",
    artworkUrl: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02e4cd26d38c6f0661a363bc65",
    note: `i know the original meaning of this one is sadder than the way people usually use it. but what i take from it is wanting your love to stay with someone even when you physically can't. and considering how much of our relationship happens with miles between us, that hits me pretty hard.`,
  },
  {
    id: "i-dont-want-to-miss-a-thing", number: 29, title: "I Don't Want to Miss a Thing", artist: "Aerosmith", cover: coverFor(29),
    spotifyUri: "spotify:track:225xvV8r1yKMHErSWivnow",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02da8d92affd796f7e20af7375",
    note: `this one is so embarrassingly cheesy and i don't even care. i want the big moments with you, obviously, but i also want all the boring ones. sleepy mornings, random conversations, sitting around doing absolutely nothing. i want the normal parts too.`,
  },
  {
    id: "always-somewhere-2015-remaster", number: 30, title: "Always Somewhere (2015 - Remaster)", artist: "Scorpions", cover: coverFor(30),
    spotifyUri: "spotify:track:6RG9WyeGTkM1xwI2gzUhbH",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02f35497447472b2434fd1d2ca",
    note: `this one is painfully accurate when you're always somewhere and the person you want isn't there. i hate that sometimes loving you means missing you from another place. but i love the little promise underneath it: i'm coming back to you.`,
  },
  {
    id: "just-the-way-you-are", number: 31, title: "Just The Way You Are", artist: "Pierce The Veil", cover: coverFor(31),
    spotifyUri: "spotify:track:5d6nTdahyEnH1TILFC0Tp3",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e024978eed9f147170024b9a65b",
    note: `yes, i specifically needed the pierce the veil version because apparently normal romance wasn't enough for this playlist. but the message is still simple: i like you exactly as you are, handsome. glasses, black hair, annoying behavior and everything.`,
  },
  {
    id: "i-miss-you", number: 32, title: "I Miss You", artist: "blink-182", cover: coverFor(32),
    spotifyUri: "spotify:track:1oTo3ijRbaDAtrjJrGAPSw",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e020a4ae12eb3a9fb7e3815001c",
    note: `do i even need to explain this one? i miss you. constantly. sometimes five minutes after we stop talking, which is actually embarrassing. distance has made those three words way too relevant to my life.`,
  },
  {
    id: "caraphernelia", number: 33, title: "Caraphernelia", artist: "Pierce The Veil", cover: coverFor(33),
    spotifyUri: "spotify:track:2G8PweZBBwTpyP8vpNQJK2",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e025eae69bbe37d5f382155e387",
    note: `this song is messy and intense and definitely not my blueprint for a healthy relationship. but i understand that feeling of someone leaving pieces of themselves everywhere in your life. you've somehow gotten into my routines, my thoughts, my phone, my music, everything.`,
  },
  {
    id: "a-match-into-water", number: 34, title: "A Match Into Water", artist: "Pierce The Veil", cover: coverFor(34),
    spotifyUri: "spotify:track:54MXF9I8s3DuiQo3g0gZ5k",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02077cac00c2d9075e6f742570",
    note: `this one has so much fear and desperation inside it. what i take from it is that horrible feeling of imagining someone you love hurting and wishing you could do something, anything, to make it better. if you're ever going through something, i hope you never think you have to do it alone.`,
  },
  {
    id: "in-my-room", number: 35, title: "In My Room", artist: "Julia Wolf", cover: coverFor(35),
    spotifyUri: "spotify:track:2Ui2JtVjnbHZuExldryCOA",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02a89fdceada45b52f0de8601c",
    note: `this one makes me think about how badly i want the normal physical parts of being together. your stuff in my room. you taking up space beside me. little signs everywhere that you actually live in my world and not just inside my phone. someday, baby.`,
  },
  {
    id: "if-im-james-dean-youre-audrey-hepburn", number: 36, title: "If I'm James Dean, You're Audrey Hepburn", artist: "Sleeping With Sirens", cover: coverFor(36),
    spotifyUri: "spotify:track:1wFRkVclQWfMQQcaVLjmBE",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02d2cb1b09807037c68bab8b13",
    note: `i love the whole stupidly romantic idea of two people looking at each other and thinking maybe this could actually be something. that's me with you. i don't need us to be some famous love story. i just want ours.`,
  },
  {
    id: "only-one", number: 37, title: "Only One", artist: "Yellowcard", cover: coverFor(37),
    spotifyUri: "spotify:track:0gZp88SA5OcujHLDGkxtI3",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02d1fd8f264564d9eef7617a45",
    note: `the actual song comes from a breakup, so i'm stealing this title for my own purposes. out of everyone i could have ended up caring about this much, somehow it's you. my favorite boy. my one very annoying exception to my peace and quiet.`,
  },
  {
    id: "six-candles", number: 38, title: "Six Candles", artist: "FM Static", cover: coverFor(38),
    spotifyUri: "spotify:track:6M6ygXjmi1V4kekp5xxqOH",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02bdc92e5001b3121bef7bd5e9",
    note: `i like the hope in this one. that feeling of still believing in someone when things are uncertain and still wanting to stay beside them through it. i hope we're always able to be that kind of safe place for each other.`,
  },
  {
    id: "even-when-im-not-with-you", number: 39, title: "Even When I'm Not With You", artist: "Pierce The Veil", cover: coverFor(39),
    spotifyUri: "spotify:track:6yJmxPGazR55GAQdyHPf6q",
    artworkUrl: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e022846907b5152fb7dc38e450a",
    note: `this is literally us. i'm not beside you, but i'm still with you. you're in my thoughts, my routines, the random things i see, the songs i hear, and basically everything i want to tell somebody. miles away and somehow still everywhere.`,
  },
  {
    id: "all-mine", number: 40, title: "ALL MINE", artist: "whatsaheart", cover: coverFor(40),
    spotifyUri: "spotify:track:0Yg2JX24pCRIcqZRC5aJU8",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e027b011aa36819e35decf29441",
    note: `i'm trying not to sound possessive here but also... mine. i just really like knowing that out of everyone in the world, you're my boyfriend and i'm your girl. that's such a small sentence for something that makes me ridiculously happy.`,
  },
  {
    id: "can-you-take-me-home-tonight", number: 41, title: "can you take me home tonight?", artist: "Snave", cover: coverFor(41),
    spotifyUri: "spotify:track:2xBOAjZYISlzwHBAKZF9ul",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e022b2a3bb3400b43dcee3e3c69",
    note: `maybe "home" doesn't have to be one specific place. maybe eventually it's wherever we end up together. i just know i'm really looking forward to the day when going home can mean going back to you.`,
  },
  {
    id: "flames-acoustic", number: 42, title: "Flames (feat. Avril Lavigne) [Acoustic]", artist: "MOD SUN, Avril Lavigne", cover: coverFor(42),
    spotifyUri: "spotify:track:6bHO3zGU6RarIsp62su2DI",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0273b8dc78845de7f39432bd19",
    note: `this one is for that stupid kind of attraction where no matter how many times you look at the person, you're still like, "yeah, unfortunately i'm extremely into you." that's me. still very much into you. tragic.`,
  },
  {
    id: "ignite", number: 43, title: "Ignite", artist: "Nocturne's Kiss", cover: coverFor(43),
    spotifyUri: "spotify:track:1s6uXV0N6dcWGjm2ykwLX7",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02d49bdf66efd5c2a733adf971",
    note: `some songs are here because of one specific meaning and some are here because they just feel like us when i listen to them. this is one of those. it has that intense, restless feeling that makes me think about wanting somebody so badly that everything suddenly feels louder.`,
  },
  {
    id: "be-quiet-and-drive-far-away", number: 44, title: "Be Quiet and Drive (Far Away)", artist: "Deftones", cover: coverFor(44),
    spotifyUri: "spotify:track:4Uiw0Sl9yskBaC6P4DcdVD",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e020b1129853982ea17845d4eb6",
    note: `sometimes i really do wish we could just disappear somewhere together. no screens, no distance, no schedules, no responsibilities for a little while. just get in a car, go somewhere far away, and be together.`,
  },
  {
    id: "follow-you", number: 45, title: "Follow You", artist: "Bring Me The Horizon", cover: coverFor(45),
    spotifyUri: "spotify:track:6lFUdRItQEsEuD7dSINL47",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0290b88187a9831d91f2438927",
    note: `i don't expect us to never struggle or never annoy the hell out of each other. i just want us to keep finding our way back to the same side. because even when loving someone gets complicated, i'd still rather figure it out with you than imagine a life where you're just gone.`,
  },
  {
    id: "bad-romance", number: 46, title: "Bad Romance", artist: "Halestorm", cover: coverFor(46),
    spotifyUri: "spotify:track:0n3sHHfdOq6Awix3JPe3xl",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e022230ea0226f28c710728c840",
    note: `this is not me manifesting a toxic relationship, before you start. i just love how loud, messy, dramatic, and completely shameless this song is about wanting someone. sometimes a cute little love song isn't enough. sometimes i need guitars.`,
  },
  {
    id: "vermilion-pt-2", number: 47, title: "Vermilion, Pt. 2", artist: "Slipknot", cover: coverFor(47),
    spotifyUri: "spotify:track:0O7lENhqOySbsL743G7PqD",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e026b3463e7160d333ada4b175a",
    note: `this one is way darker than what i actually feel about us, but the longing in it gets me. that feeling where someone occupies so much space in your head even when they aren't physically there. fortunately for me, you're real. you're just annoyingly far away.`,
  },
  {
    id: "hanging-by-a-moment", number: 48, title: "Hanging By A Moment", artist: "Lifehouse", cover: coverFor(48),
    spotifyUri: "spotify:track:6jWLyg8AuMQ9LtIB2UlfOF",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0231539dc49b964e11ccc239a7",
    note: `i like the idea of not knowing exactly where everything is going but still wanting to be there for it. we don't know every detail of our future yet. and that's okay. i just really like the fact that i get to find out what happens next with you.`,
  },
  {
    id: "my-heroine", number: 49, title: "My Heroine", artist: "Silverstein", cover: coverFor(49),
    spotifyUri: "spotify:track:6NDoBIaqTHdcudaR8RDJNw",
    artworkUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02aade7ea1ce5e7f75f6d40a3c",
    note: `ending this playlist with another insanely dramatic song feels correct for us. i'm not taking the addiction metaphor literally, obviously. i just like music that makes love sound huge and overwhelming and a little dangerous. apparently normal love songs were never going to be enough for this playlist.`,
  },
];
