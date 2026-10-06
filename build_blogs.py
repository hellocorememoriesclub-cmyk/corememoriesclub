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
<link rel="stylesheet" href="css/style.css?v=3">
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
      <a href="blogs.html">Blogs</a>
      <a href="faq.html">FAQ</a>
    </nav>
    <div class="header-actions">
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
        <a href="index.html" class="logo"><span class="mark">🌍</span> Core Memories Club</a>
        <p class="about-txt">India's festival &amp; group travel club. We plan the trip, you bring the crew — Ibiza to Iceland, Tomorrowland to Zurich.</p>
        <div class="footer-socials">
          <a href="#" class="icon-btn">📸</a>
          <a href="#" class="icon-btn">🎵</a>
          <a href="#" class="icon-btn">📘</a>
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
          <li><a href="faq.html">FAQ</a></li>
          <li><a href="privacy-policy.html">Privacy Policy</a></li>
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
      <span><a href="privacy-policy.html">Privacy Policy</a> &nbsp;·&nbsp; <a href="terms.html">Terms &amp; Conditions</a></span>
    </div>
  </div>
  <div class="disclaimer">Core Memories Club is not affiliated with or endorsed by Tomorrowland.</div>
</footer>

<script src="js/main.js"></script>
</body>
</html>
"""

def related_card(slug, title, date, img):
    return f'''<a class="blog-card" href="{slug}.html">
          <div class="blog-media"><img src="{img}" alt="{title}"></div>
          <div class="blog-body"><div class="blog-date">{date}</div><h3>{title}</h3></div>
        </a>'''

POSTS = [
    {
        "slug": "blog-island-life",
        "title": "Discovering Island Life Beyond Luxury",
        "date": "25 Feb 2026",
        "img": "images/photos/blog-island-life.jpg",
        "desc": "What Bali and Ibiza taught us about slowing down between the parties.",
        "body": """
        <p class="lead-p">Everyone plans the closing party. Almost no one plans the morning after — and that's usually where the actual memory lives.</p>
        <h2>Morning Before The Music</h2>
        <p>In Bali, our groups start most days before 7am, not because we're strict about it, but because that's when Ubud's rice terraces are empty and the light is unbeatable. It's the same in Ibiza — the island most people never see is the one before noon, when the beach clubs are still being swept and the water is glass.</p>
        <h2>The Locals' Bali</h2>
        <p>Every itinerary we run leaves at least one afternoon unscheduled on purpose. That's usually when travellers find the warung with no sign, the surf break nobody's filming, or just a hammock and three hours to do nothing. We've learned not to over-plan the in-between.</p>
        <h2>Ibiza After Dark Isn't The Whole Story</h2>
        <p>Yes, we'll get you into the clubs. But some of the best feedback we get is about the boat mornings — a slow sail out from San Antonio before anyone's even thinking about the night ahead.</p>
        <h2>How We Build These Days In</h2>
        <p>It's a simple rule on our itineraries: for every big night, one slow morning. It's why our groups come back saying the trip felt like more than a highlight reel.</p>
        """,
    },
    {
        "slug": "blog-europe-routes",
        "title": "Experiencing Europe Beyond Tourist Routes",
        "date": "10 Mar 2026",
        "img": "images/photos/blog-europe-routes.jpg",
        "desc": "Zurich, Paris and the quiet corners of Europe most itineraries skip.",
        "body": """
        <p class="lead-p">Europe's biggest cities get flattened into a checklist — this tower, that museum, one canal photo. We build our routes to leave room for what's in between.</p>
        <h2>Zurich's Quiet Lakeside</h2>
        <p>Most first-timers are surprised Zurich has a lake at all. Ours always get an evening free along it — a short tram ride from the old town, and a completely different pace than the city centre.</p>
        <h2>Paris Beyond The Eiffel Tower</h2>
        <p>We still take you to the Tower — it's non-negotiable, honestly. But we pair it with an early Louvre entry before the crowds, and a neighbourhood walk through the Marais that most package tours skip entirely.</p>
        <h2>Getting Off The Rail Pass Route</h2>
        <p>The standard Europe circuit runs through five cities in seven days. We'd rather do three properly. Fewer check-ins, more actual time in each place — it's a small change that makes a big difference in how a trip feels afterward.</p>
        """,
    },
    {
        "slug": "blog-packing-guide",
        "title": "The Ultimate Festival Packing Guide",
        "date": "02 Apr 2026",
        "img": "images/photos/girl-backpack-path.jpg",
        "desc": "Everything our repeat travellers never leave home without.",
        "body": """
        <p class="lead-p">We've sent enough groups to enough festivals to know exactly what gets left behind — and what everyone wishes they'd packed.</p>
        <h2>The Non-Negotiables</h2>
        <p>A dedicated phone power bank, a printed copy of your visa and insurance docs, and a compact rain layer — even for "dry season" destinations. Belgium in July has proven this rule more than once.</p>
        <h2>Weather-Proofing Your Kit</h2>
        <p>Layer, don't bulk up. A festival day can swing from 15°C mornings to a warm afternoon to a cold 2am walk back to camp. Pack for all three, not just the photos.</p>
        <h2>What Our Trip Captains Always Say</h2>
        <p>Comfortable shoes over cute shoes, always. And a small dry bag for your phone and cash — it comes up more often than you'd think, whether it's Koh Phangan's beach or a sudden Munich downpour.</p>
        <h2>Ibiza vs Thailand vs Belgium: What Changes</h2>
        <p>Ibiza calls for lightweight everything and a going-out outfit that survives 4am. Thailand needs sun protection and quick-dry fabric. Belgium's festival season means packing for genuinely unpredictable weather — check our destination-specific lists when you book.</p>
        """,
    },
    {
        "slug": "blog-schengen-visa",
        "title": "Schengen Visa Guide for Indian Festival-Goers",
        "date": "18 Apr 2026",
        "img": "images/dest-tomorrowland.svg",
        "desc": "Everything you need for a smooth Belgium visa approval before Tomorrowland season.",
        "body": """
        <p class="lead-p">A Schengen visa rejection two weeks before a festival is the single most avoidable travel disaster we see. Here's how we keep our travellers out of that situation.</p>
        <h2>Documents You'll Need</h2>
        <p>Valid passport with six months' validity beyond your return date, proof of accommodation, a locked-in flight itinerary, travel insurance meeting the €30,000 minimum coverage requirement, and proof of funds. We prepare a checklist specific to your trip when you book.</p>
        <h2>Timeline: When To Apply</h2>
        <p>Apply no earlier than six months and no later than three weeks before travel — but for festival season specifically, we push our travellers to apply the moment dates are confirmed. Appointment slots at Belgium's visa centres fill up fast in festival months.</p>
        <h2>Common Rejection Reasons</h2>
        <p>Inconsistent trip details between your flight, hotel, and application, insufficient bank statement history, and unclear ties to India showing intent to return are the top three we see. All three are preventable with the right paperwork, prepared early.</p>
        <h2>How We Help</h2>
        <p>Every Belgium package includes visa document review before submission and a dedicated point of contact for questions during processing. It's part of why our visa approval rate stays high season after season.</p>
        """,
    },
    {
        "slug": "blog-northern-lights",
        "title": "Chasing the Northern Lights: A First-Timer's Guide",
        "date": "30 Apr 2026",
        "img": "images/photos/iceland-aurora.jpg",
        "desc": "Best months, best spots, and what to actually wear in -10°C.",
        "body": """
        <p class="lead-p">The aurora doesn't run on a schedule, but there's a lot you can do to stack the odds in your favour — and dress so you actually enjoy the wait.</p>
        <h2>Best Months To Go</h2>
        <p>Late September through March gives you the dark skies you need. We run our Iceland batches November through February specifically, when clear-night odds are highest.</p>
        <h2>Where We Base You</h2>
        <p>We keep groups just outside Reykjavik's light pollution but close enough for a quick return if the sky doesn't cooperate on night one — you'll usually get two or three chances across the trip.</p>
        <h2>What To Actually Wear</h2>
        <p>Thermal base layer, a proper insulated outer shell, and — this one surprises people — hand warmers for your camera batteries, which drain fast in the cold.</p>
        <h2>Managing Expectations</h2>
        <p>It's not always the vivid green of the photos to the naked eye — cameras pick up more than your eyes do. But standing under it, even a faint aurora, tends to be the moment travellers talk about long after the trip.</p>
        """,
    },
    {
        "slug": "blog-solo-travel",
        "title": "Solo Travel, Group Energy: How Our Trips Work",
        "date": "12 May 2026",
        "img": "images/photos/ibiza-party.jpg",
        "desc": "Why going solo on a Core Memories trip never actually feels solo.",
        "body": """
        <p class="lead-p">More than half the travellers who book with us are travelling alone. By day two, almost none of them are eating dinner by themselves.</p>
        <h2>Why Solo Travellers Choose Group Trips</h2>
        <p>Booking solo often means either overpaying for a single room or hoping you meet people along the way. Our trips solve both — shared accommodation built in, and a group that's already there from day one.</p>
        <h2>How We Build The Group</h2>
        <p>We cap group sizes so it stays personal, and our trip captains are deliberate about the first day — shared meals, one low-key group activity, no pressure. The rest tends to happen on its own.</p>
        <h2>Safety &amp; Support On The Ground</h2>
        <p>A dedicated trip captain travels with every group, plus a local contact at each destination. Solo travellers, especially, tell us this is what made booking alone feel like a easy decision.</p>
        <h2>Real Stories</h2>
        <p>We've had travellers land solo in Ibiza and leave with a group chat that's still active a year later. That's the actual product — the trip is just how it starts.</p>
        """,
    },
]

for i, post in enumerate(POSTS):
    others = [p for p in POSTS if p["slug"] != post["slug"]][:3]
    related_html = "\n        ".join(
        related_card(o["slug"], o["title"], o["date"], o["img"]) for o in others
    )
    html = HEAD.format(title=post["title"], desc=post["desc"]) + f"""
<main>
  <section class="page-hero">
    <div class="wrap">
      <div class="breadcrumb"><a href="blogs.html">Blogs</a> / {post['title']}</div>
      <h1 style="font-size:clamp(28px,4.4vw,44px)">{post['title']}</h1>
      <p>{post['date']} · Core Memories Club</p>
    </div>
  </section>

  <section class="section">
    <div class="wrap" style="max-width:760px">
      <div class="blog-media" style="border-radius:var(--radius-lg);height:360px;margin-bottom:36px">
        <img src="{post['img']}" alt="{post['title']}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-lg)">
      </div>
      <div class="article-body">
        {post['body']}
      </div>
    </div>
  </section>

  <section class="section-tight">
    <div class="wrap">
      <div class="cta-banner">
        <div><h3>Got travel plans in your mind?</h3><p>We're just a call away — tell us your dream trip and we'll build it.</p></div>
        <a href="book-a-trip.html" class="btn btn-accent">Contact Us →</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <div><span class="eyebrow">Keep Reading</span><h2>More From The Blog</h2></div>
      </div>
      <div class="grid grid-3">
        {related_html}
      </div>
    </div>
  </section>
</main>
""" + FOOT

    with open(os.path.join(ROOT, f"{post['slug']}.html"), "w", encoding="utf-8") as f:
        f.write(html)
    print(f"wrote {post['slug']}.html")
