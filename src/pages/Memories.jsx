import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const memoriesData = [
    { img: "/photos/WhatsApp%20Image%202026-03-06%20at%2011.13.08%20AM.jpeg", title: "Her Smile Says It All", cap: "You're truly one of the most wonderful people I know, and I feel blessed to have you as my elder sister.✨" },
    { img: "/photos/WhatsApp%20Image%202026-03-06%20at%2011.13.09%20AM.jpeg", title: "Together Vibes", cap: "May your journey ahead be filled with happiness, success, and endless smiles.😊🌟" },
    { img: "/photos/WhatsApp%20Image%202026-03-06%20at%2011.13.09%20AM%20(1).jpeg", title: "Beautiful Soul", cap: "Keep being the amazing person you are—you make every moment brighter.🌸✨" },
    { img: "/photos/WhatsApp%20Image%202026-03-06%20at%2011.13.11%20AM.jpeg", title: "Precious Moments", cap: "Every moment with you is a treasure worth cherishing forever.💫" },
    { img: "/photos/WhatsApp%20Image%202026-03-06%20at%2011.13.11%20AM%20(1).jpeg", title: "Joyful Times", cap: "Your laughter and joy light up every room you enter.🎉" },
    { img: "/photos/WhatsApp%20Image%202026-03-06%20at%2011.13.12%20AM.jpeg", title: "Always There", cap: "Thank you for being such an amazing elder sister and friend.🌺" },
    { img: "/photos/WhatsApp%20Image%202026-03-06%20at%2011.13.12%20AM%20(1).jpeg", title: "Special Bond", cap: "Our bond is one of the most precious gifts in my life.🌟" },
    { img: "/photos/WhatsApp%20Image%202026-03-06%20at%2011.13.13%20AM.jpeg", title: "Beautiful Memories", cap: "Creating wonderful memories together, one moment at a time.✨" },
    { img: "/photos/WhatsApp%20Image%202026-03-06%20at%2011.14.10%20AM.jpeg", title: "Forever Grateful", cap: "Grateful for every laugh, every talk, and every shared moment.💕" },
    { img: "/photos/WhatsApp%20Image%202026-03-06%20at%2011.20.57%20AM.jpeg", title: "Celebrating You", cap: "Today we celebrate the amazing person you are. Happy Birthday! 🎂" },
    { img: "/photos/WhatsApp%20Image%202026-03-06%20at%201.19.21%20PM.jpeg", title: "Radiant Moments", cap: "Your energy and positivity make every day brighter.🌈" },
    { img: "/photos/WhatsApp%20Image%202026-03-06%20at%201.22.31%20PM.jpeg", title: "Pure Joy", cap: "Seeing you happy is one of life's greatest gifts.💖" },
    { img: "/photos/WhatsApp%20Image%202026-03-06%20at%201.22.59%20PM.jpeg", title: "Cherished Times", cap: "Every moment spent with you becomes a treasured memory.✨" },
    { img: "/photos/WhatsApp%20Image%202026-03-06%20at%201.24.34%20PM.jpeg", title: "Forever In My Heart", cap: "You hold a special place that no one else can fill.💝" }
];

const Memories = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        // Initial card animations
        const cards = document.querySelectorAll('.memory-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * 150);
        });

        // Observer
        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef}>
            <section className="welcome">
                <h1 className="title-gradient">Amazing Memories Together</h1>
                <p>Every moment we've shared has been special. Let's cherish these wonderful memories...</p>
            </section>

            <div className="memory-container">
                {memoriesData.map((mem, i) => (
                    <div key={i} className="memory-card">
                        <img src={mem.img} alt={`Memory ${i + 1}`} className="memory-img" />
                        <div className="memory-date">{mem.title}</div>
                        <div className="memory-caption">{mem.cap}</div>
                    </div>
                ))}
            </div>

            <section className="shamitha-message">
                <h2 className="title-gradient">A Message from Shamitha 💌</h2>
                <div className="message-content">
                    <p>
                        We joined on the same day, and I still remember my first impression of you. People always say "don't judge a book by its cover," but with you it turned out completely different because you are actually far sweeter, kinder, and more genuine than I ever imagined.
                    </p>
                    <p>
                        Usually it takes me months to get attached to people, but with you it just happened naturally. Somewhere along the way, you became like the sister I never had. Talking to you always felt effortless, I never had to think twice about what I was saying or how I was being. It was always just comfortable, real, and easy.
                    </p>
                    <p>
                        Yes, you come with your fair share of mood swings, but even that became a part of what makes you YOU! And honestly, dealing with them is something I'll probably miss too.
                    </p>
                    <p>
                        What I'm struggling with the most right now is accepting the fact that you're leaving. It doesn't feel real yet. But like you said, we're always just one call away, and I hope that never changes.
                    </p>
                    <p>
                        <strong>THANK YOU FOR EVERYTHING</strong>, for being there, for being real, for the conversations, the support, and for simply being you. You've truly left a mark.
                    </p>
                    <p>
                        And happy birthday. I really hope this year brings you everything you've ever wished for and more. You deserve all the happiness, success, and beautiful things life has to offer.
                    </p>
                    <p className="signature">
                        You'll always be special to me. 🤍
                        <br />
                        <em>— Shamitha</em>
                    </p>
                </div>
            </section>

            <section className="krishna-message">
                <h2 className="title-gradient">A Message from Krishna 💌</h2>
                <div className="message-content">
                    <p>
                        At first, I remember thinking <em>"ye bhoot kon hai?"</em> — honestly, that was my very first reaction when I saw you. I never imagined that the same person would slowly become someone so important in my life.
                    </p>
                    <p>
                        But as time passed, I started seeing a completely different side of you. The way you guided me, supported me, and stood by me like an elder sister — it meant more than you probably realize. Whenever I was confused or needed advice, you were always there, patiently explaining things and pushing me to do better.
                    </p>
                    <p>
                        Yes, you do get angry quickly, and sometimes your sudden mood changes would make me think twice before saying anything. But strangely, even that became something normal for me, something that just felt like <em>you</em>. And now when I think about it, even those moments are something I'm going to miss.
                    </p>
                    <p>
                        You didn't just become a colleague or a friend — you became someone I could rely on, someone who genuinely cared. The way you supported me, corrected me when I was wrong, and encouraged me when I needed it most is something I'll always be grateful for.
                    </p>
                    <p>
                        It's honestly hard to accept that you're leaving. It feels like a small part of everyday life is changing. But I truly hope wherever you go, you get all the success, happiness, and peace you deserve.
                    </p>
                    <p>
                        Thank you for being the amazing person you are, for guiding me, supporting me, and for being the sister I never had.
                    </p>
                    <p>
                        And once again, <strong>Happy Birthday!</strong> I hope this new year of your life brings you endless happiness, success, and everything your heart wishes for.
                    </p>
                    <p className="signature">
                        <em>— Krishna</em>
                    </p>
                </div>
            </section>

            <section className="final-message">
                <h2>Thank You for Being You</h2>
                <p>
                    Every laugh, every chat, and every moment we've shared has been truly special. 💫<br />
                    I'm so grateful to have you as my elder sister and friend, and for all the positivity you bring into my life.<br />
                    On your birthday, I wish for endless happiness, joy, and success to come your way. 🌸
                </p>
                <p>You deserve all the best in the world—keep shining and spreading your beautiful energy. ✨</p>
                <a href="/" className="goodbye-btn">
                    <span className="btn-text">Until We Celebrate Again 🎉</span>
                    <span className="btn-glow"></span>
                </a>
            </section>
        </div>
    );
};

export default Memories;
