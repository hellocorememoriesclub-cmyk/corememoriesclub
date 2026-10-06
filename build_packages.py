import os

ROOT = os.path.dirname(__file__)

HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} | Core Memories Club</title>
<meta name="description" content="{desc}">
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌍</text></svg>">
<link rel="stylesheet" href="css/style.css?v=13">
</head>
<body>

<div class="topbar">
  <div class="wrap">
    <div style="display:flex;gap:20px;flex-wrap:wrap">
      <a href="tel:+918826526252">📞 +91 88265 26252</a>
      <a href="mailto:hello@corememoriesclub.com">✉️ hello@corememoriesclub.com</a>
    </div>
    <div>1K+ travellers &amp; counting ✦ Rated 4.8/5</div>
  </div>
</div>

<header class="site-header">
  <div class="wrap">
    <a href="index.html" class="logo"><span class="mark">🌍</span> Core Memories Club</a>
    <nav class="main-nav">
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="tours.html">Tours</a>
      <a href="gallery.html">Gallery</a>
      <a href="blogs.html">Blogs</a>
      <a href="faq.html">FAQ</a>
    </nav>
    <div class="header-actions">
      <div class="search-box">
        <form class="search-form" id="siteSearchForm">
          <input type="text" id="siteSearchInput" placeholder="Search destinations..." autocomplete="off">
        </form>
        <button class="icon-btn search-toggle" id="searchToggle" aria-label="Search destinations">🔍</button>
      </div>
      <a href="book-a-trip.html" class="btn btn-accent btn-sm">Book a Trip</a>
      <button class="icon-btn menu-toggle" aria-label="Open menu">☰</button>
    </div>
  </div>
</header>

<div class="mobile-nav">
  <button class="close-btn" aria-label="Close menu">✕</button>
  <a href="index.html">Home</a>
  <a href="about.html">About</a>
  <a href="tours.html">Tours</a>
  <a href="gallery.html">Gallery</a>
  <a href="blogs.html">Blogs</a>
  <a href="faq.html">FAQ</a>
  <a href="book-a-trip.html">Book a Trip</a>
</div>
"""

FOOT = """
<div class="ticker">
  <div class="ticker-track">
    <span>✈️ Custom Tours</span><span>🌍 Worldwide Destinations</span><span>🏝️ Luxury &amp; Budget Travel</span><span>🧳 Visa Assistance</span><span>🏨 Hotel Bookings</span><span>🚗 Transfers &amp; Rentals</span>
    <span>✈️ Custom Tours</span><span>🌍 Worldwide Destinations</span><span>🏝️ Luxury &amp; Budget Travel</span><span>🧳 Visa Assistance</span><span>🏨 Hotel Bookings</span><span>🚗 Transfers &amp; Rentals</span>
  </div>
</div>

<footer>
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <a href="index.html" class="logo"><img src="images/photos/logo.png" alt="Core Memories Club" class="logo-img"></a>
        <p class="about-txt">India's festival &amp; group travel club. We plan the trip, you bring the crew — Ibiza to Iceland, Tomorrowland to Zurich.</p>
        <div class="footer-socials">
          <a href="https://www.instagram.com/corememoriesclub" target="_blank" rel="noopener noreferrer" class="icon-btn" aria-label="Instagram">📸</a>
          <a href="https://x.com/jituux" target="_blank" rel="noopener noreferrer" class="icon-btn" aria-label="X (Twitter)">🐦</a>
          <a href="https://www.linkedin.com/in/jitendra-raut/" target="_blank" rel="noopener noreferrer" class="icon-btn" aria-label="LinkedIn">💼</a>
        </div>
      </div>
      <div>
        <h5>Pages</h5>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="tours.html">Tours</a></li>
          <li><a href="book-a-trip.html">Book a Trip</a></li>
          <li><a href="blogs.html">Blogs</a></li>
        </ul>
      </div>
      <div>
        <h5>Other Pages</h5>
        <ul>
          <li><a href="gallery.html">Gallery</a></li>
          <li><a href="faq.html">FAQ</a></li>
          <li><a href="privacy-policy.html">Privacy Policy</a></li>
          <li><a href="payment-policy.html">Payment Policy</a></li>
          <li><a href="terms.html">Terms &amp; Conditions</a></li>
          <li><a href="404.html">404</a></li>
        </ul>
      </div>
      <div>
        <h5>Get In Touch</h5>
        <ul>
          <li>📞 +91 88265 26252</li>
          <li>✉️ hello@corememoriesclub.com</li>
          <li>📍 Mumbai, India</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Core Memories Club. All rights reserved.</span>
      <span><a href="privacy-policy.html">Privacy Policy</a> &nbsp;·&nbsp; <a href="payment-policy.html">Payment Policy</a> &nbsp;·&nbsp; <a href="terms.html">Terms &amp; Conditions</a></span>
    </div>
  </div>
  <div class="disclaimer">Core Memories Club is not affiliated with or endorsed by Tomorrowland.</div>
</footer>

<script src="js/main.js"></script>
</body>
</html>
"""

def itin_day(n, title, body):
    return f'''<div class="itin-day{' open' if n == 1 else ''}">
          <div class="itin-day-head"><span class="itin-day-badge">Day {n}</span><h4>{title}</h4><span class="plus">+</span></div>
          <div class="itin-day-body"><p>{body}</p></div>
        </div>'''

def qf(icon, label, val):
    return f'''<div class="qf-item"><span class="qf-ic">{icon}</span><div><div class="qf-label">{label}</div><div class="qf-val">{val}</div></div></div>'''

PACKAGES = [
    {
        "slug": "ibiza-closing-fiesta",
        "title": "Ibiza Closing Fiesta 2026",
        "desc": "6 Days / 5 Nights in Ibiza — beach clubs, boat parties and the legendary closing season. Starting ₹1,45,000.",
        "hero": "images/photos/ibiza-party.jpg",
        "days_label": "6 Days / 5 Nights",
        "price": "₹1,45,000",
        "price_note": "",
        "badge": "",
        "quick_facts": [qf("📍", "Departure City", "Mumbai / Delhi"), qf("🕒", "Duration", "5 Nights &amp; 6 Days"), qf("✈️", "Flight Detail", "With Flight"), qf("🛂", "Visa", "Included")],
        "overview": "Step into the world's most iconic party island as Ibiza's legendary closing season lights up one last time. From beach clubs at sunrise to boat parties under the stars, this is six days built entirely around the island's biggest nights — with your stay, transfers, and club access handled end-to-end by our team.",
        "itinerary": [
            itin_day(1, "Arrival in Ibiza — Check-In &amp; Sunset Welcome", "Land in Ibiza, transfer to your beachfront stay, and ease in with a welcome sunset session at a beach bar before the trip properly begins."),
            itin_day(2, "Beach Club Day — Ushuaïa &amp; Beyond", "A full day at Ibiza's iconic beach clubs — pool access, live sets, and the daytime party scene the island is famous for."),
            itin_day(3, "Sunset Boat Party", "Sail out from San Antonio on a chartered boat party with music, swimming stops, and the island's best sunset view from the water."),
            itin_day(4, "Old Town, Dalt Vila &amp; Hidden Coves", "A slower day exploring Ibiza's UNESCO old town, followed by a quiet afternoon at one of the island's less-crowded beaches."),
            itin_day(5, "Closing Party Night", "The night it's all been building to — entry to one of Ibiza's headline closing party events, with the group together till sunrise."),
            itin_day(6, "Departure", "Check out and transfer to the airport with, hopefully, very little sleep and zero regrets."),
        ],
    },
    {
        "slug": "tomorrowland-belgium",
        "title": "Tomorrowland Belgium 2026",
        "desc": "7 Days / 6 Nights — Amsterdam, Brussels and DreamVille for the world's biggest dance music festival. Starting ₹2,45,000.",
        "hero": "images/photos/festival-tent-night.jpg",
        "days_label": "7 Days / 6 Nights",
        "price": "₹2,45,000",
        "price_note": "",
        "badge": "Sold Out",
        "quick_facts": [qf("📍", "Departure City", "On Demand"), qf("🕒", "Duration", "6 Nights &amp; 7 Days"), qf("✈️", "Flight Detail", "With Flight"), qf("🛂", "Visa", "Schengen — Assisted")],
        "overview": "Tomorrowland isn't just a festival — it's a once-a-year pilgrimage. This itinerary pairs Amsterdam's canals and Brussels' old town with full DreamVille festival access, so you get the full European trip, not just a weekend at a stage.",
        "itinerary": [
            itin_day(1, "Arrival in Amsterdam — The Journey Begins", "Land in Amsterdam and settle into your stay, with the evening free to explore the city's canal-side streets."),
            itin_day(2, "Dutch Countryside &amp; Amsterdam Canal Cruise", "A day trip through the Dutch countryside followed by an evening canal cruise through Amsterdam's historic center."),
            itin_day(3, "Amsterdam to Brussels — City Tour &amp; Exclusive Pre-Party", "Travel to Brussels, tour the city's landmarks, and kick off the festival energy at our exclusive Core Memories pre-party."),
            itin_day(4, "Brussels to DreamVille — The Gathering", "Transfer to DreamVille, the official Tomorrowland campsite, and settle in as the festival grounds come alive."),
            itin_day(5, "Tomorrowland Day One", "Full festival access — every stage, every set, with your crew and our on-ground trip captain close by."),
            itin_day(6, "Tomorrowland Day Two", "The festival's biggest day — headline sets, DreamVille's own parties, and a night none of you will fully remember clearly."),
            itin_day(7, "Departure", "Check out of DreamVille and transfer back for your onward flight home."),
        ],
    },
    {
        "slug": "koh-phangan-full-moon",
        "title": "Koh Phangan Full Moon Party",
        "desc": "5 Days / 4 Nights across Bangkok and Koh Phangan for Thailand's legendary Full Moon Party. Starting ₹65,000.",
        "hero": "images/pkg-fullmoon.svg",
        "days_label": "5 Days / 4 Nights",
        "price": "₹65,000",
        "price_note": '<span class="strike" style="font-size:15px">₹80,000</span>',
        "badge": "Save ₹15,000/-",
        "quick_facts": [qf("📍", "Departure City", "On Demand"), qf("🕒", "Duration", "4 Nights &amp; 5 Days"), qf("✈️", "Flight Detail", "With Flight"), qf("🛂", "Visa", "Visa on Arrival")],
        "overview": "Thailand's most famous beach party, done properly — two days in Bangkok to get settled, then straight to Koh Phangan's white sand for the Full Moon Party itself. Boat transfers, beach stay, and party access all handled for you.",
        "itinerary": [
            itin_day(1, "Arrival in Bangkok", "Land in Bangkok and check in, with the evening free to explore the city's street food scene."),
            itin_day(2, "Bangkok City Tour", "Temples, markets, and Bangkok's best rooftop bars before heading south."),
            itin_day(3, "Transfer to Koh Phangan", "Ferry across to Koh Phangan and check into your beachfront stay, with the island's build-up parties already underway."),
            itin_day(4, "Full Moon Party Night", "The main event — an entire beach turned into one open-air party under the full moon, with your crew right in the middle of it."),
            itin_day(5, "Departure", "Recover, check out, and transfer back for your flight home."),
        ],
    },
    {
        "slug": "zurich-new-year",
        "title": "Zurich New Year Escape",
        "desc": "5 Days / 4 Nights in Zurich to ring in the New Year in the Swiss Alps. Starting ₹1,35,000.",
        "hero": "images/pkg-zurich-nye.svg",
        "days_label": "5 Days / 4 Nights",
        "price": "₹1,35,000",
        "price_note": "",
        "badge": "New",
        "quick_facts": [qf("📍", "Departure City", "On Demand"), qf("🕒", "Duration", "4 Nights &amp; 5 Days"), qf("✈️", "Flight Detail", "With Flight"), qf("🛂", "Visa", "Schengen — Assisted")],
        "overview": "Swap the usual New Year's Eve house party for the Swiss Alps. Five days pairing Zurich's lakeside charm with a proper alpine day trip, ending in a New Year's Eve celebration most people only see in photos.",
        "itinerary": [
            itin_day(1, "Arrival in Zurich", "Land in Zurich and check into your stay, with an easy first evening along the lakeside old town."),
            itin_day(2, "Old Town &amp; Lake Cruise", "Explore Zurich's cobblestone old town followed by an afternoon cruise on Lake Zurich."),
            itin_day(3, "Swiss Alps Day Trip", "A full day trip into the Alps — snow, mountain views, and a proper break from the city."),
            itin_day(4, "New Year's Eve Celebration", "Ring in the New Year with Zurich's lakeside fireworks and celebrations as a group."),
            itin_day(5, "Departure", "Check out and transfer to the airport to head home."),
        ],
    },
    {
        "slug": "oktoberfest-munich",
        "title": "Oktoberfest Munich 2026",
        "desc": "6 Days / 5 Nights in Munich for the world's largest beer festival. Starting ₹1,65,000.",
        "hero": "images/pkg-oktoberfest.svg",
        "days_label": "6 Days / 5 Nights",
        "price": "₹1,65,000",
        "price_note": "",
        "badge": "New",
        "quick_facts": [qf("📍", "Departure City", "On Demand"), qf("🕒", "Duration", "5 Nights &amp; 6 Days"), qf("✈️", "Flight Detail", "With Flight"), qf("🛂", "Visa", "Schengen — Assisted")],
        "overview": "Beer tents the size of stadiums, Bavarian brass bands, and a fortnight-long festival that shuts down the entire city in the best way. This trip pairs full Oktoberfest access with a day trip to Neuschwanstein Castle, so it's not beer tents alone.",
        "itinerary": [
            itin_day(1, "Arrival in Munich", "Land in Munich and settle into your stay, with the evening free to explore the city center."),
            itin_day(2, "Oktoberfest Opening Day", "Head to the festival grounds for reserved beer tent access on one of the biggest days of the fortnight."),
            itin_day(3, "Beer Tents &amp; Bavarian Culture", "A full second day at Oktoberfest — different tents, live oompah bands, and the full Bavarian experience."),
            itin_day(4, "Neuschwanstein Castle Day Trip", "A day trip out to Bavaria's fairytale castle, a welcome breather between festival days."),
            itin_day(5, "Munich City Tour &amp; Farewell Night", "A relaxed city tour followed by one last night out in Munich with the group."),
            itin_day(6, "Departure", "Check out and transfer to the airport for your flight home."),
        ],
    },
    {
        "slug": "paris-city-lights",
        "title": "Paris City Lights",
        "desc": "6 Days / 5 Nights in Paris — the Eiffel Tower, the Louvre, and everything in between. Starting ₹1,25,000.",
        "hero": "images/pkg-paris-lights.svg",
        "days_label": "6 Days / 5 Nights",
        "price": "₹1,25,000",
        "price_note": "",
        "badge": "",
        "quick_facts": [qf("📍", "Departure City", "On Demand"), qf("🕒", "Duration", "5 Nights &amp; 6 Days"), qf("✈️", "Flight Detail", "With Flight"), qf("🛂", "Visa", "Schengen — Assisted")],
        "overview": "Paris, done right — the Eiffel Tower lit up at night, an early Louvre entry before the crowds, and a proper Versailles day trip, balanced with enough free time to just wander the city's neighbourhoods.",
        "itinerary": [
            itin_day(1, "Arrival in Paris", "Land in Paris and check into your stay, with the evening free along the Seine."),
            itin_day(2, "Eiffel Tower &amp; Seine River Cruise", "Visit the Eiffel Tower followed by an evening river cruise past the city's illuminated landmarks."),
            itin_day(3, "Louvre &amp; Montmartre", "An early entry to the Louvre followed by an afternoon wandering Montmartre's artist streets."),
            itin_day(4, "Versailles Day Trip", "A full day trip to the Palace of Versailles and its gardens."),
            itin_day(5, "Champs-Élysées &amp; Farewell Dinner", "Shopping along the Champs-Élysées followed by a group farewell dinner."),
            itin_day(6, "Departure", "Check out and transfer to the airport for your flight home."),
        ],
    },
    {
        "slug": "iceland-northern-lights",
        "title": "Iceland Northern Lights",
        "desc": "7 Days / 6 Nights chasing the Aurora Borealis across Iceland. Starting ₹1,95,000.",
        "hero": "images/photos/iceland-aurora.jpg",
        "days_label": "7 Days / 6 Nights",
        "price": "₹1,95,000",
        "price_note": "",
        "badge": "",
        "quick_facts": [qf("📍", "Departure City", "On Demand"), qf("🕒", "Duration", "6 Nights &amp; 7 Days"), qf("✈️", "Flight Detail", "With Flight"), qf("🛂", "Visa", "Schengen — Assisted")],
        "overview": "Iceland's Golden Circle, glacier lagoons, and two dedicated nights chasing the Aurora Borealis away from city light pollution. Batches run November through February, when the dark skies give you the best odds.",
        "itinerary": [
            itin_day(1, "Arrival in Reykjavik", "Land in Reykjavik and check into your stay, with the evening free in the city."),
            itin_day(2, "Golden Circle Tour", "Geysers, waterfalls, and the Þingvellir rift valley on Iceland's most famous day-trip route."),
            itin_day(3, "South Coast Waterfalls &amp; Black Sand Beach", "Seljalandsfoss, Skógafoss, and the black sand beaches of Vík."),
            itin_day(4, "Blue Lagoon &amp; First Aurora Hunt", "Relax in the Blue Lagoon's geothermal waters, then head out for your first night of northern lights chasing."),
            itin_day(5, "Glacier Lagoon Day Trip", "A full day at the Jökulsárlón glacier lagoon, with icebergs drifting past on the water."),
            itin_day(6, "Reykjavik City &amp; Second Aurora Chase", "A relaxed day in the city followed by a second, farther-out aurora hunt."),
            itin_day(7, "Departure", "Check out and transfer to the airport for your flight home."),
        ],
    },
    {
        "slug": "bali-island-escape",
        "title": "Bali Island Escape",
        "desc": "7 Days / 6 Nights across Seminyak and Ubud — beach clubs, rice terraces and temples. Starting ₹85,000.",
        "hero": "images/photos/pool-bench.jpg",
        "days_label": "7 Days / 6 Nights",
        "price": "₹85,000",
        "price_note": "",
        "badge": "",
        "quick_facts": [qf("📍", "Departure City", "On Demand"), qf("🕒", "Duration", "6 Nights &amp; 7 Days"), qf("✈️", "Flight Detail", "With Flight"), qf("🛂", "Visa", "Visa on Arrival")],
        "overview": "Three days of Seminyak's beach clubs and sunsets, then four days slowing down in Ubud's rice terraces and temples. Bali's two very different sides, both covered.",
        "itinerary": [
            itin_day(1, "Arrival in Seminyak", "Land in Bali and check into your beachfront stay in Seminyak."),
            itin_day(2, "Beach Clubs &amp; Sunset", "A full day at Seminyak's iconic beach clubs, ending with a sunset session by the water."),
            itin_day(3, "Transfer to Ubud", "Travel inland to Ubud, checking into your stay surrounded by rice terraces."),
            itin_day(4, "Rice Terraces &amp; Temples", "Visit the Tegallalang rice terraces and a handful of Ubud's most striking temples."),
            itin_day(5, "Waterfalls &amp; Monkey Forest", "A day trip to Bali's waterfalls followed by a visit to the Sacred Monkey Forest Sanctuary."),
            itin_day(6, "Spa Day &amp; Local Markets", "A relaxed final day — traditional Balinese spa treatments and Ubud's local markets."),
            itin_day(7, "Departure", "Check out and transfer to the airport for your flight home."),
        ],
    },
    {
        "slug": "goa-beach-getaway",
        "title": "Goa Beach Getaway",
        "desc": "4 Days / 3 Nights across North and South Goa. Starting ₹22,000.",
        "hero": "images/pkg-goa.svg",
        "days_label": "4 Days / 3 Nights",
        "price": "₹22,000",
        "price_note": "",
        "badge": "",
        "quick_facts": [qf("📍", "Departure City", "Any Metro City"), qf("🕒", "Duration", "3 Nights &amp; 4 Days"), qf("✈️", "Flight Detail", "With Flight"), qf("🛂", "Visa", "Not Required")],
        "overview": "A quick beach reset — North Goa's party beaches and beach shacks, then South Goa's quieter shores and old Portuguese churches, all in a long weekend.",
        "itinerary": [
            itin_day(1, "Arrival — North Goa Beaches", "Land in Goa, check in, and spend the afternoon at North Goa's beaches."),
            itin_day(2, "Water Sports &amp; Beach Shacks", "Parasailing and jet skiing by day, beach shacks and live music by night."),
            itin_day(3, "South Goa &amp; Old Churches", "A quieter day exploring South Goa's beaches and the old town's Portuguese-era churches."),
            itin_day(4, "Departure", "Check out and transfer to the airport."),
        ],
    },
    {
        "slug": "kerala-backwaters",
        "title": "Kerala Backwaters &amp; Houseboat",
        "desc": "5 Days / 4 Nights across Alleppey and Munnar — houseboats and tea gardens. Starting ₹28,500.",
        "hero": "images/pkg-kerala.svg",
        "days_label": "5 Days / 4 Nights",
        "price": "₹28,500",
        "price_note": "",
        "badge": "",
        "quick_facts": [qf("📍", "Departure City", "Any Metro City"), qf("🕒", "Duration", "4 Nights &amp; 5 Days"), qf("✈️", "Flight Detail", "With Flight"), qf("🛂", "Visa", "Not Required")],
        "overview": "A night on a traditional Kerala houseboat drifting through Alleppey's backwaters, followed by three days in Munnar's cool tea-garden hills.",
        "itinerary": [
            itin_day(1, "Arrival in Alleppey", "Land and check into your houseboat stay for the evening."),
            itin_day(2, "Houseboat Cruise on the Backwaters", "A full day drifting through Alleppey's backwaters on your private houseboat."),
            itin_day(3, "Transfer to Munnar", "Travel up into Munnar's tea-garden hills and check into your stay."),
            itin_day(4, "Tea Gardens &amp; Waterfalls", "Visit Munnar's rolling tea estates and a handful of the region's waterfalls."),
            itin_day(5, "Departure", "Check out and transfer to the airport."),
        ],
    },
    {
        "slug": "rishikesh-adventure",
        "title": "Rishikesh Adventure &amp; Camping",
        "desc": "3 Days / 2 Nights of river rafting, camping and bungee jumping in Rishikesh. Starting ₹12,500.",
        "hero": "images/pkg-rishikesh.svg",
        "days_label": "3 Days / 2 Nights",
        "price": "₹12,500",
        "price_note": "",
        "badge": "",
        "quick_facts": [qf("📍", "Departure City", "Delhi / NCR"), qf("🕒", "Duration", "2 Nights &amp; 3 Days"), qf("🚌", "Transport", "By Road"), qf("🛂", "Visa", "Not Required")],
        "overview": "A short, adrenaline-heavy weekend — white water rafting on the Ganga, a night camping riverside, and enough optional bungee jumping to make your group chat regret nothing.",
        "itinerary": [
            itin_day(1, "Arrival &amp; River Rafting", "Arrive in Rishikesh and head straight into a white water rafting session on the Ganga."),
            itin_day(2, "Camping &amp; Bungee Jumping", "A day of optional adventure activities — bungee jumping, giant swing — followed by a night camping riverside."),
            itin_day(3, "Ganga Aarti &amp; Departure", "A morning at the Ganga Aarti ceremony before heading back."),
        ],
    },
    {
        "slug": "ibiza-sunset-sail",
        "title": "Ibiza Sunset &amp; Sail Escape",
        "desc": "5 Days / 4 Nights in Ibiza built around beach clubs and a sunset sail. Price on demand.",
        "hero": "images/photos/ibiza-party.jpg",
        "days_label": "5 Days / 4 Nights",
        "price": "Price on Demand",
        "price_note": "",
        "badge": "",
        "quick_facts": [qf("📍", "Departure City", "On Demand"), qf("🕒", "Duration", "4 Nights &amp; 5 Days"), qf("✈️", "Flight Detail", "With Flight"), qf("🛂", "Visa", "Schengen — Assisted")],
        "overview": "A shorter, calmer take on Ibiza — beach clubs by day, a proper sunset sail, and enough downtime to actually enjoy the island beyond the party scene.",
        "itinerary": [
            itin_day(1, "Arrival in Ibiza", "Land in Ibiza and check into your stay, with the evening free."),
            itin_day(2, "Beach Club Day", "A full day at one of Ibiza's beach clubs — pool, music, and daytime party energy."),
            itin_day(3, "Sunset Sail", "An evening sail along the coast, ending with Ibiza's famous sunset from the water."),
            itin_day(4, "Old Town &amp; Leisure", "A relaxed day exploring Ibiza's old town, with the afternoon free."),
            itin_day(5, "Departure", "Check out and transfer to the airport."),
        ],
    },
    {
        "slug": "ibiza-club-circuit",
        "title": "Ibiza Club Circuit",
        "desc": "6 Days / 5 Nights hitting Ibiza's biggest clubs — Pacha, Amnesia, Ushuaïa. Starting ₹1,45,000.",
        "hero": "images/photos/ibiza-party.jpg",
        "days_label": "6 Days / 5 Nights",
        "price": "₹1,45,000",
        "price_note": "",
        "badge": "",
        "quick_facts": [qf("📍", "Departure City", "On Demand"), qf("🕒", "Duration", "5 Nights &amp; 6 Days"), qf("✈️", "Flight Detail", "With Flight"), qf("🛂", "Visa", "Schengen — Assisted")],
        "overview": "Built for people who want every major Ibiza club on one trip — Pacha, Amnesia and Ushuaïa across five nights, with a beach day built in to recover between them.",
        "itinerary": [
            itin_day(1, "Arrival in Ibiza", "Land in Ibiza and check into your stay, with the evening free to settle in."),
            itin_day(2, "Pacha — Club Night One", "Entry to Pacha, one of Ibiza's most legendary clubs, for your first big night."),
            itin_day(3, "Beach Day Recovery", "A slow beach day to recover before the next round."),
            itin_day(4, "Amnesia — Club Night Two", "Entry to Amnesia for a night built around its iconic main room."),
            itin_day(5, "Ushuaïa Day Party", "A full daytime party at Ushuaïa, closing out the circuit in style."),
            itin_day(6, "Departure", "Check out and transfer to the airport."),
        ],
    },
    {
        "slug": "ibiza-barcelona-combo",
        "title": "Ibiza + Barcelona Combo",
        "desc": "9 Days / 8 Nights combining Ibiza's party scene with Barcelona's culture and beaches. Price on demand.",
        "hero": "images/photos/ibiza-party.jpg",
        "days_label": "9 Days / 8 Nights",
        "price": "Price on Demand",
        "price_note": "",
        "badge": "",
        "quick_facts": [qf("📍", "Departure City", "On Demand"), qf("🕒", "Duration", "8 Nights &amp; 9 Days"), qf("✈️", "Flight Detail", "With Flight"), qf("🛂", "Visa", "Schengen — Assisted")],
        "overview": "Five days of Ibiza's beach clubs and nightlife, then four days of Barcelona's architecture, tapas, and city beaches — the best of both worlds on one trip.",
        "itinerary": [
            itin_day(1, "Arrival in Ibiza", "Land in Ibiza and check into your stay."),
            itin_day(2, "Beach Clubs", "A full day at Ibiza's iconic beach clubs."),
            itin_day(3, "Sunset Boat Party", "A chartered boat party along the coast, ending with Ibiza's sunset from the water."),
            itin_day(4, "Old Town &amp; Leisure", "A relaxed day exploring Ibiza's old town."),
            itin_day(5, "Transfer to Barcelona", "Fly to Barcelona and check into your city stay."),
            itin_day(6, "Barcelona City Tour &amp; Sagrada Família", "Visit Gaudí's Sagrada Família and tour the city's landmark architecture."),
            itin_day(7, "Park Güell &amp; Gothic Quarter", "Explore Park Güell followed by an afternoon wandering the Gothic Quarter."),
            itin_day(8, "Beach Day &amp; Tapas Night", "A relaxed beach day followed by a group tapas dinner."),
            itin_day(9, "Departure", "Check out and transfer to the airport for your flight home."),
        ],
    },
]

for pkg in PACKAGES:
    thumbs = "\n        ".join(
        f'<img src="{pkg["hero"]}" alt="{pkg["title"]}" class="{"active" if i == 0 else ""}">' for i in range(3)
    )
    qf_html = "\n        ".join(pkg["quick_facts"])
    itin_html = "\n        ".join(pkg["itinerary"])
    badge_html = f'<span class="pkg-tag" style="position:static;display:inline-block;margin-bottom:10px">{pkg["badge"]}</span><br>' if pkg["badge"] else ""

    html = HEAD.format(title=pkg["title"], desc=pkg["desc"]) + f"""
<main>
  <section class="page-hero" style="padding:36px 0 24px;text-align:left">
    <div class="wrap">
      <div class="breadcrumb"><a href="tours.html">Tours</a> / {pkg['title']}</div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="wrap pkg-layout">
      <div>
        <div class="pkg-detail-hero"><img src="{pkg['hero']}" alt="{pkg['title']}"></div>

        {badge_html}
        <h1 style="font-size:clamp(26px,3.6vw,36px);font-weight:800;margin-bottom:18px;color:var(--ink)">{pkg['title']}</h1>

        <div class="quick-facts">
          {qf_html}
        </div>

        <h2 style="font-size:20px;font-weight:800;margin-bottom:12px">Overview</h2>
        <div class="overview-text" id="overview-{pkg['slug']}">
          <p>{pkg['overview']}</p>
        </div>
        <button class="read-more-toggle" data-target="#overview-{pkg['slug']}">Read More</button>

        <h2 style="font-size:20px;font-weight:800;margin:32px 0 16px">Trip Itinerary</h2>
        {itin_html}
      </div>

      <div class="pkg-sidebar">
        <div class="price-card">
          <div class="pc-label">Price Start From</div>
          <div class="pc-price">{pkg['price']} {pkg['price_note']}</div>
          <div class="pc-per">Per Person</div>
          <a href="#quoteForm" class="btn btn-accent btn-block" data-scroll-to="#quoteForm">Enquire Now →</a>
          <div class="price-card-btns">
            <a href="tel:+918826526252" class="btn btn-outline btn-sm" style="flex:1;justify-content:center;border-color:var(--border);color:var(--ink)">Call Us</a>
            <a href="https://wa.me/918826526252" target="_blank" rel="noopener noreferrer" class="btn btn-sm" style="flex:1;justify-content:center;background:#25d366;color:#fff">WhatsApp</a>
          </div>
        </div>

        <div class="quote-card">
          <h4>Get Your Dream Trip Quote</h4>
          <p>Fill details &amp; get a response within 2 hours</p>
        </div>

        <div class="quote-form" id="quoteForm">
          <form id="bookingForm" novalidate>
            <input type="hidden" name="destination" value="{pkg['title']}">
            <div class="form-row">
              <div class="form-group"><label>First Name</label><input type="text" name="firstName" required placeholder="First name"><span class="field-error" data-for="name"></span></div>
              <div class="form-group"><label>Last Name</label><input type="text" name="lastName" placeholder="Last name"></div>
            </div>
            <div class="form-group"><label>Email Address</label><input type="email" name="email" required placeholder="you@example.com"><span class="field-error" data-for="email"></span></div>
            <div class="form-group"><label>Phone Number</label><input type="tel" name="phone" required placeholder="+91 98765 43210"><span class="field-error" data-for="phone"></span></div>
            <div class="form-row">
              <div class="form-group"><label>Adults</label><input type="number" name="adults" min="0" placeholder="0"></div>
              <div class="form-group"><label>Children (Optional)</label><input type="number" name="children" min="0" placeholder="0"></div>
            </div>
            <div class="form-group"><label>Your Message (Optional)</label><textarea name="message" rows="3" placeholder="Travel preferences, special requirements..."></textarea></div>
            <button type="submit" class="btn btn-accent btn-block">Get Quote →</button>
            <p id="formMsg" style="display:none;margin-top:14px;font-weight:600;font-size:13.5px"></p>
          </form>
        </div>
      </div>
    </div>
  </section>

  <section class="section-tight">
    <div class="wrap">
      <div class="cta-banner">
        <div><h3>Not quite what you're looking for?</h3><p>Browse every trip we run, or tell us what you have in mind.</p></div>
        <a href="tours.html" class="btn btn-accent">See All Tours →</a>
      </div>
    </div>
  </section>
</main>
""" + FOOT

    with open(os.path.join(ROOT, f"{pkg['slug']}.html"), "w", encoding="utf-8") as f:
        f.write(html)
    print(f"wrote {pkg['slug']}.html")
