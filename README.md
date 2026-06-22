```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GoBus README</title>

<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    background:#0d1117;
    color:#9eff9e;
    font-family:'Press Start 2P', cursive;
    padding:40px;
    line-height:1.8;
}

.container{
    max-width:1200px;
    margin:auto;
}

.header{
    text-align:center;
    border:4px solid #00ff66;
    padding:30px;
    background:#051b0d;
    box-shadow:0 0 20px #00ff66;
}

h1{
    font-size:3rem;
    color:#00ff66;
    margin-bottom:20px;
}

.subtitle{
    color:#b6ffb6;
}

.section{
    margin-top:40px;
    border:3px solid #00cc55;
    padding:25px;
    background:#08140b;
}

.section h2{
    color:#00ff66;
    margin-bottom:20px;
}

ul{
    margin-left:25px;
}

li{
    margin-bottom:12px;
}

.tech-grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
    gap:20px;
}

.card{
    border:2px solid #00ff66;
    padding:20px;
    background:#0f1e13;
}

.footer{
    text-align:center;
    margin-top:40px;
    border:3px solid #00ff66;
    padding:25px;
    background:#051b0d;
}

.pixel-line{
    color:#00ff66;
    overflow:hidden;
    white-space:nowrap;
    margin-bottom:15px;
}
</style>
</head>

<body>

<div class="container">

    <div class="header">
        <div class="pixel-line">
            ██████╗  ██████╗ ██████╗ ██╗   ██╗███████╗
        </div>

        <h1>🚌 GoBus</h1>

        <p class="subtitle">
            Smart Bus Booking Platform
        </p>
    </div>

    <div class="section">
        <h2>🎯 About</h2>

        <p>
            GoBus is a smart mobility platform that enables users
            to search, compare and book bus tickets quickly while
            providing a seamless travel experience.
        </p>
    </div>

    <div class="section">
        <h2>✨ Features</h2>

        <ul>
            <li>🚌 Bus Ticket Booking</li>
            <li>📍 Real-Time Bus Tracking</li>
            <li>🎫 Digital Tickets</li>
            <li>💳 Secure Payments</li>
            <li>🔔 Smart Notifications</li>
            <li>⭐ Ratings & Reviews</li>
        </ul>
    </div>

    <div class="section">
        <h2>⚙️ Tech Stack</h2>

        <div class="tech-grid">

            <div class="card">
                <h3>Frontend</h3>
                <p>HTML, CSS, JavaScript</p>
            </div>

            <div class="card">
                <h3>Backend</h3>
                <p>Spring Boot</p>
            </div>

            <div class="card">
                <h3>Database</h3>
                <p>MySQL</p>
            </div>

            <div class="card">
                <h3>APIs</h3>
                <p>Maps, Payment Gateway</p>
            </div>

        </div>
    </div>

    <div class="section">
        <h2>🚀 Future Roadmap</h2>

        <ul>
            <li>🚇 Metro Integration</li>
            <li>🤖 AI Travel Assistant</li>
            <li>🎓 Student Benefits</li>
            <li>📦 Parcel Delivery</li>
            <li>🌍 Multi-Modal Transport</li>
        </ul>
    </div>

    <div class="footer">
        <h2>🟩 GoBus</h2>
        <p>Smart Travel Starts Here</p>
    </div>

</div>

</body>
</html>
```
