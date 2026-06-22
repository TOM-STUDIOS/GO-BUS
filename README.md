<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GoBus · AI‑powered mobility</title>
    <!-- Font Awesome 6 (free) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: #f5f9f5;
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 2rem 1rem;
        }

        .card {
            max-width: 960px;
            width: 100%;
            background: white;
            border-radius: 3rem 3rem 2rem 2rem;
            box-shadow: 0 30px 60px rgba(0, 40, 0, 0.12);
            padding: 2.5rem 2.8rem;
            transition: all 0.2s ease;
            border: 1px solid #d0e6d0;
        }

        /* header */
        .brand {
            text-align: center;
            margin-bottom: 2rem;
        }

        .brand h1 {
            font-size: 3.8rem;
            font-weight: 700;
            letter-spacing: -1px;
            color: #004d00;
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
        }

        .brand h1 i {
            font-size: 2.8rem;
            color: #2b7a2b;
            background: #e4f3e4;
            padding: 0.4rem 0.8rem;
            border-radius: 60px;
        }

        .brand .sub {
            font-size: 1.6rem;
            font-weight: 400;
            color: #1f5f1f;
            margin-top: 0.1rem;
            letter-spacing: -0.3px;
        }

        .brand .sub span {
            background: #ddf0dd;
            padding: 0.1rem 1rem;
            border-radius: 40px;
            display: inline-block;
            margin-top: 0.2rem;
            font-weight: 500;
        }

        .tagline {
            text-align: center;
            font-size: 1.25rem;
            color: #235f23;
            background: #ecf7ec;
            padding: 0.5rem 1.8rem;
            border-radius: 60px;
            display: inline-block;
            margin: 0 auto 1.6rem;
            border: 1px solid #b9dbb9;
            backdrop-filter: blur(2px);
        }

        .tagline i {
            margin: 0 6px;
            color: #006400;
        }

        .badge-group {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.6rem 0.9rem;
            margin: 1.2rem 0 1.8rem;
        }

        .badge-group img {
            height: 32px;
            border-radius: 30px;
            transition: 0.2s;
        }

        .badge-group img:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 10px rgba(0, 80, 0, 0.15);
        }

        hr.divider {
            margin: 2rem 0 1.8rem;
            border: 0;
            height: 3px;
            background: linear-gradient(90deg, transparent, #2f7a2f, #7bb87b, #2f7a2f, transparent);
            border-radius: 10px;
        }

        /* grid features */
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.2rem 1.5rem;
            margin: 1.8rem 0 2rem;
        }

        .feature-item {
            background: #f6fcf6;
            padding: 1rem 1.2rem;
            border-radius: 40px;
            font-weight: 500;
            color: #003300;
            border: 1px solid #cce5cc;
            display: flex;
            align-items: center;
            gap: 0.8rem;
            font-size: 1rem;
            transition: 0.15s;
            box-shadow: 0 2px 6px rgba(0, 30, 0, 0.02);
        }

        .feature-item i {
            font-size: 1.4rem;
            width: 2rem;
            color: #006400;
            background: #dff0df;
            padding: 0.3rem 0;
            text-align: center;
            border-radius: 30px;
        }

        .feature-item:hover {
            background: #e6f5e6;
            border-color: #4d9e4d;
            transform: translateY(-2px);
        }

        .tech-stack {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.5rem 0.8rem;
            margin: 1rem 0 1.8rem;
        }

        .tech-stack img {
            height: 34px;
            border-radius: 30px;
            filter: drop-shadow(0 2px 4px rgba(0, 30, 0, 0.05));
        }

        .description {
            background: #fafffa;
            padding: 1.8rem 2rem;
            border-radius: 60px 20px 60px 20px;
            border-left: 8px solid #2b7a2b;
            box-shadow: inset 0 1px 8px rgba(0, 50, 0, 0.02);
            margin: 1.6rem 0 2rem;
        }

        .description p {
            font-size: 1.2rem;
            line-height: 1.6;
            color: #103010;
            font-weight: 400;
        }

        .description strong {
            color: #004d00;
            font-weight: 600;
        }

        .ai-badge {
            background: #004d00;
            color: white;
            padding: 0.2rem 1.2rem;
            border-radius: 60px;
            font-size: 0.9rem;
            font-weight: 600;
            letter-spacing: 0.3px;
            display: inline-block;
            margin-right: 6px;
        }

        .footer-tag {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            gap: 1rem 1.5rem;
            background: #eaf5ea;
            padding: 1rem 2rem;
            border-radius: 60px;
            margin-top: 1.6rem;
            border: 1px solid #b9dbb9;
        }

        .footer-tag .left {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 0.5rem 1rem;
            font-weight: 500;
            color: #004d00;
        }

        .footer-tag .left i {
            font-size: 1.4rem;
        }

        .footer-tag .right {
            display: flex;
            gap: 0.8rem;
            color: #004d00;
        }

        .footer-tag .right i {
            font-size: 1.6rem;
            opacity: 0.75;
            transition: 0.2s;
        }

        .footer-tag .right i:hover {
            opacity: 1;
            transform: scale(1.1);
            color: #006400;
        }

        .demo-note {
            text-align: center;
            font-size: 0.9rem;
            color: #2c6b2c;
            margin-top: 1.6rem;
            border-top: 1px dashed #b9dbb9;
            padding-top: 1rem;
            letter-spacing: 0.2px;
        }

        .demo-note i {
            color: #006400;
            margin: 0 0.2rem;
        }

        @media (max-width: 600px) {
            .card {
                padding: 1.8rem 1.2rem;
            }
            .brand h1 {
                font-size: 2.8rem;
            }
            .brand .sub {
                font-size: 1.2rem;
            }
            .description p {
                font-size: 1rem;
            }
            .footer-tag {
                flex-direction: column;
                align-items: flex-start;
            }
        }
    </style>
</head>
<body>

<div class="card">

    <!-- HEADER -->
    <div class="brand">
        <h1>
            <i class="fas fa-bus-alt"></i> GoBus<span style="font-weight:300;color:#2a7a2a;">+</span>
        </h1>
        <div class="sub">
            <span><i class="fas fa-robot" style="margin-right:6px;"></i> AI‑powered mobility</span>
        </div>
    </div>

    <!-- TAGLINE -->
    <div style="text-align:center;">
        <div class="tagline">
            <i class="fas fa-route"></i> Book · Track · Combine <i class="fas fa-arrow-right"></i> Metro · Bus · Auto · Cab
        </div>
    </div>

    <!-- BADGES (status + version) -->
    <div class="badge-group">
        <img src="https://img.shields.io/badge/STATUS-LIVE-006400?style=for-the-badge&logo=vercel&logoColor=white" alt="status" />
        <img src="https://img.shields.io/badge/VERSION-2.0--AI-006400?style=for-the-badge&logo=openai&logoColor=white" alt="version" />
        <img src="https://img.shields.io/badge/BUILD-DEMO-006400?style=for-the-badge&logo=netlify&logoColor=white" alt="demo" />
        <img src="https://img.shields.io/badge/FIGMA-READY-006400?style=for-the-badge&logo=figma&logoColor=white" alt="figma" />
    </div>

    <!-- divider -->
    <hr class="divider" />

    <!-- FEATURES (enhanced) -->
    <div class="feature-grid">
        <div class="feature-item"><i class="fas fa-brain"></i> AI Smart Route</div>
        <div class="feature-item"><i class="fas fa-subway"></i> Metro + Bus + Auto</div>
        <div class="feature-item"><i class="fas fa-taxi"></i> Cab integration</div>
        <div class="feature-item"><i class="fas fa-location-dot"></i> Live multi‑track</div>
        <div class="feature-item"><i class="fas fa-ticket"></i> Digital pass</div>
        <div class="feature-item"><i class="fas fa-shield-alt"></i> Secure (demo)</div>
        <div class="feature-item"><i class="fas fa-bell"></i> Smart alerts</div>
        <div class="feature-item"><i class="fas fa-star"></i> AI recommendations</div>
    </div>

    <!-- TECH STACK (demo only: html, css, js, figma, netlify) -->
    <div class="tech-stack">
        <img src="https://img.shields.io/badge/HTML5-006400?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
        <img src="https://img.shields.io/badge/CSS3-006400?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
        <img src="https://img.shields.io/badge/JavaScript-006400?style=for-the-badge&logo=javascript&logoColor=white" alt="JS" />
        <img src="https://img.shields.io/badge/Figma-006400?style=for-the-badge&logo=figma&logoColor=white" alt="Figma" />
        <img src="https://img.shields.io/badge/Netlify-006400?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify" />
        <!-- extra "no backend" hint -->
        <span style="background:#e1f0e1; padding:0.2rem 1.2rem; border-radius:40px; font-weight:500; color:#004d00; font-size:0.9rem; display:inline-flex;align-items:center;gap:6px;">
            <i class="fas fa-cloud-moon"></i> frontend demo
        </span>
    </div>

    <!-- DESCRIPTION (enhanced with AI + multi‑modal) -->
    <div class="description">
        <p>
            <span class="ai-badge"><i class="fas fa-microchip"></i> AI‑first</span>
            <strong>GoBus+</strong> is not just a bus app – it’s an <strong>intelligent travel companion</strong>.
            Powered by a smart routing engine, it combines <strong>metro, bus, auto‑rickshaw, and cab</strong>
            into one seamless journey. <br />
            <i class="fas fa-arrow-right" style="color:#006400; margin:0 4px;"></i>
            Tell the AI <i>“from A to B”</i> and it suggests the fastest, cheapest, or greenest mix of transport.
            Real‑time tracking, digital tickets, and predictive alerts — all in one demo.
            <span style="display:block; margin-top:0.5rem; font-weight:400; color:#1a4f1a;">
                <i class="fas fa-pen-fancy"></i> Designed in Figma · deployed on Netlify · no backend needed.
            </span>
        </p>
    </div>

    <!-- FOOTER / TAGLINE + TOOLS -->
    <div class="footer-tag">
        <div class="left">
            <i class="fas fa-route"></i>
            <span><strong>Bus · Metro · Auto · Cab</strong> &nbsp;|&nbsp; AI multimodal</span>
        </div>
        <div class="right">
            <i class="fas fa-paint-brush" title="Figma design"></i>
            <i class="fas fa-cloud-upload-alt" title="Netlify deploy"></i>
            <i class="fas fa-code" title="HTML + CSS + JS"></i>
            <i class="fas fa-robot" title="AI layer (demo)"></i>
        </div>
    </div>

    <!-- tiny demo note -->
    <div class="demo-note">
        <i class="fas fa-crown"></i> most advanced booking demo · AI mode · multi‑modal · 100% frontend <i class="fas fa-crown"></i>
    </div>

</div>

<!-- (no backend, pure html/css/js demo) -->
</body>
</html>
