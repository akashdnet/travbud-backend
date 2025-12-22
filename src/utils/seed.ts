import Tour from "../modules/trip/trip.model";
import User from "../modules/user/user.model";
import modelWebReviews from "../modules/website-reviews/model.webReviews";



export const trips1 = [
    {
        name: 'Swiss Alps Mountain Climbing Expedition',
        description:
            'Embark on a 3-day guided adventure through the majestic Swiss Alps. Perfect for nature lovers and thrill-seekers who want a safe, eco-conscious, and unforgettable mountain experience.',
        price: 100,
        days: 3,
        image: 'https://images.unsplash.com/photo-1696791474537-dee1afb9ab17',
        location: 'Interlaken, Switzerland',
        startDate: '2025-12-25',
        endDate: '2025-12-27',
        itinerary: [
            'Day 1: Arrival in Interlaken, welcome dinner, gear check & orientation',
            'Day 2: Ascent to Jungfrau Base Camp, safety briefing, overnight in alpine hut',
            'Day 3: Sunrise summit climb, panoramic views, return & farewell lunch',
        ],
        highlights: [
            'Panoramic 360° views from Jungfrau summit',
            'Certified IFMGA mountain guides',
            'Small group: max 8 travelers',
            'Carbon-neutral tour certified by Swiss EcoTravel',
        ],
        inclusions: [
            '2 nights in eco-friendly mountain huts',
            'All meals (local organic cuisine)',
            'Full climbing gear: helmet, harness, crampons',
            'Emergency satellite communicator & first-aid',
        ],
        exclusions: [
            'International flights & travel insurance',
            'Alpine permit fee (CHF 25, payable on-site)',
            'Personal items & tips',
        ],
        difficulty: 'Moderate to Challenging',
        groupSize: 8,
        guide: "6936cc8eccd7c825ade9ce04",
        faq: [
            { q: 'Do I need prior climbing experience?', a: 'No! Basic fitness is required...' },
            { q: 'What’s the max group size?', a: 'We keep it intimate at 8 travelers...' },
            { q: 'Is this tour eco-certified?', a: 'Yes! We offset 200% of CO2...' },
        ],
    },
    {
        name: 'Nepal Himalaya Annapurna Circuit Trek',
        description:
            'A 10-day journey through ancient trails, high mountain passes, and Tibetan-influenced villages in the heart of the Himalayas.',
        price: 420,
        days: 10,
        image: 'https://images.unsplash.com/photo-1660048055185-1e16c4ae80d2',
        location: 'Annapurna, Nepal',
        startDate: '2025-10-10',
        endDate: '2025-10-19',
        itinerary: [
            'Day 1: Arrival in Kathmandu, cultural orientation',
            'Day 2: Drive to Besisahar, trek begins',
            'Day 3–8: Trek through Manang, cross Thorong La Pass (5,416m)',
            'Day 9: Descend to Muktinath, cultural visit',
            'Day 10: Fly back to Kathmandu, farewell dinner',
        ],
        highlights: [
            'Cross one of the world’s highest trekking passes',
            'Stay in family-run teahouses',
            'Guided by certified local Sherpa team',
            'Includes heritage tour in Kathmandu',
        ],
        inclusions: [
            '9 nights accommodation',
            'All meals during trek',
            'Domestic flights (Pokhara–Kathmandu)',
            'Trekking permit & TIMS card',
        ],
        exclusions: [
            'Nepal visa fee',
            'Travel insurance with altitude coverage',
            'Personal trekking gear',
            'Tips for guides and porters',
        ],
        difficulty: 'Challenging',
        groupSize: 10,
        guide: "6936cc8eccd7c825ade9ce04",
        faq: [
            { q: 'What is the highest altitude reached?', a: '5,416 meters at Thorong La Pass.' },
            { q: 'Do I need a visa for Nepal?', a: 'Yes, available on arrival for most nationalities.' },
        ],
    },
    {
        name: 'Iceland Aurora & Glacier Explorer',
        description:
            'Chase the Northern Lights and walk on glaciers in this 5-day winter adventure across South Iceland’s dramatic landscapes.',
        price: 520,
        days: 5,
        image: 'https://images.unsplash.com/photo-1694536989753-869197d808c5',
        location: 'Reykjavík, Iceland',
        startDate: '2025-02-15',
        endDate: '2025-02-19',
        itinerary: [
            'Day 1: Golden Circle tour (Geysir, Gullfoss, Þingvellir)',
            'Day 2: South Coast: Seljalandsfoss, black sand beach, glacier hike',
            'Day 3: Ice cave tour + glacier walk',
            'Day 4: Northern Lights hunt (multiple locations)',
            'Day 5: Blue Lagoon & departure',
        ],
        highlights: [
            'Guaranteed Northern Lights viewing or free retry',
            'Walk inside a real glacier ice cave',
            'Small-group adventure (max 12)',
            'Carbon-offset certified operator',
        ],
        inclusions: [
            '4 nights in eco-friendly guesthouses',
            'Breakfast & 2 dinners',
            'All guided activities & entrance fees',
            'Thermal suit & glacier gear',
        ],
        exclusions: [
            'International flights',
            'Lunches & most dinners',
            'Blue Lagoon premium upgrade',
            'Travel insurance',
        ],
        difficulty: 'Moderate',
        groupSize: 12,
        guide: "6936cc8eccd7c825ade9ce04",
        faq: [
            { q: 'What if we don’t see the Northern Lights?', a: 'We offer a free second night hunt.' },
            { q: 'Is glacier hiking safe for beginners?', a: 'Yes — full safety briefing and gear provided.' },
        ],
    },
    {
        name: 'Bali Volcano Sunrise & Jungle Retreat',
        description:
            'Hike Mount Batur at dawn, soak in hot springs, and unwind in Ubud’s lush rainforest during this 3-day cultural escape.',
        price: 180,
        days: 3,
        image: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220',
        location: 'Ubud, Bali, Indonesia',
        startDate: '2025-07-01',
        endDate: '2025-07-03',
        itinerary: [
            'Day 1: Arrival in Ubud, welcome blessing ceremony',
            'Day 2: 2 AM pickup, sunrise hike on Mount Batur, hot spring relax',
            'Day 3: Tirta Empul water temple visit, departure',
        ],
        highlights: [
            'Witness sunrise from 1,717m volcanic summit',
            'Traditional Balinese breakfast with mountain views',
            'Includes private transport & local guide',
            'Supports community-based tourism',
        ],
        inclusions: [
            '2 nights in jungle eco-resort',
            'All meals (Balinese cuisine)',
            'Private guide & transport',
            'Hiking permits & temple offerings',
        ],
        exclusions: [
            'International flights',
            'Personal travel insurance',
            'Spa treatments & souvenirs',
        ],
        difficulty: 'Moderate',
        groupSize: 6,
        guide: "6936cc8eccd7c825ade9ce04",
        faq: [
            { q: 'How early do we start the hike?', a: 'Pickup at 2:00 AM for a 4:30 AM summit sunrise.' },
            { q: 'Is the hike suitable for beginners?', a: 'Yes — steady pace with frequent breaks.' },
        ],
    },
];





const reviews = [
    {
        userId: "6936cc8eccd7c825ade9ce04",
        rating: 5,
        comment: "This tour was absolutely incredible. The guides were professional, the views were breathtaking, and the overall organization made me feel safe and excited throughout the journey."
    },
    {
        userId: "6936cc8eccd7c825ade9ce04",
        rating: 4,
        comment: "Great experience with minor hiccups. The climb was challenging but rewarding, and I appreciated the attention to detail in the itinerary."
    },
    {
        userId: "6936cc8eccd7c825ade9ce04",
        rating: 5,
        comment: "The trip was decent, but the schedule felt rushed. Food options could have been better, though the scenery made up for it."
    },
    {
        userId: "6936cc8eccd7c825ade9ce04",
        rating: 5,
        comment: "An unforgettable adventure! Camping under the stars, reaching the summit, and sharing stories with fellow travelers made this tour truly special."
    }
]

export const createReviews = async () => {
    const result = await modelWebReviews.create(reviews);
    if (!result) {
        console.log("Reviews not created.");
        return;
    }
    console.log("Reviews created successfully 🎉");
}















// create super admin seed 
export const createSuperAdmin = async () => {

    // if super admin already exists then return 
    const isSuperAdmin = await User.findOne({ email: "superadmin@travbud.com" });
    if (isSuperAdmin) {
        console.log("😎 Super Admin already exists.");
        return;
    };

    const superAdmin = await User.create({
        name: "Super Admin",
        email: "superadmin@travbud.com",
        password: "123456",
        role: "admin",
        status: "active",
        gender: "Male",
        age: 25,
        currentLocation: "Dhaka, Bangladesh",
        bio: "I am super admin",
        about: "I am super admin",
        contactNumber: "01300000000",
        photo: "https://res.cloudinary.com/djzqzqzq/image/upload/v1702222222/placeholder.png",
    });
    if (!superAdmin) {
        console.log("Super Admin not created.");
        return;
    }
    console.log("Super Admin created successfully 🎉");
}





export const createMultipleTrips = async () => {

    const tours = await Tour.create(trips1);
    if (!tours) {
        console.log("Tours not created.");
        return;
    }
    console.log("Tours created successfully 🎉");

}

