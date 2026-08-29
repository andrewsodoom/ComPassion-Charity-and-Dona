import bcrypt from 'bcryptjs';

export const getInitialSeedData = () => {
  // Pre-hashed passwords for 'password123'
  const salt = bcrypt.genSaltSync(10);
  const defaultPasswordHash = bcrypt.hashSync('password123', salt);

  const users = [
    {
      id: "usr_admin_1",
      name: "Platform Administrator",
      email: "admin@charityhub.org",
      password: defaultPasswordHash,
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-01-01T00:00:00.000Z"
    },
    {
      id: "usr_charity_1",
      name: "Hope Global Foundation",
      email: "hope@globalfound.org",
      password: defaultPasswordHash,
      role: "charity",
      organization: {
        legalName: "Hope Global Foundation Trust",
        registrationNumber: "80G-DEL-2021-99881",
        country: "India",
        city: "New Delhi",
        taxExemptId: "AAATH1234F",
        verificationStatus: "verified", // verified | pending | rejected
        website: "https://hopeglobalfoundation.example.org",
        phone: "+91 98765 43210",
        bio: "Dedicated to child education, nutrition, and emergency disaster relief across rural communities.",
        documents: [
          { name: "80G_Certificate.pdf", url: "https://example.com/docs/80g.pdf", verifiedAt: "2026-01-10T10:00:00.000Z" },
          { name: "Registration_Certificate.pdf", url: "https://example.com/docs/reg.pdf", verifiedAt: "2026-01-10T10:00:00.000Z" }
        ]
      },
      avatar: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-01-10T09:00:00.000Z"
    },
    {
      id: "usr_charity_2",
      name: "GreenEarth Conservation Initiative",
      email: "contact@greenearth.eco",
      password: defaultPasswordHash,
      role: "charity",
      organization: {
        legalName: "GreenEarth Conservation Society",
        registrationNumber: "501C3-USA-84920",
        country: "United States",
        city: "Seattle",
        taxExemptId: "91-3849201",
        verificationStatus: "verified",
        website: "https://greenearth.eco",
        phone: "+1 (555) 234-5678",
        bio: "Pioneering community reforestation, clean water wells, and animal wildlife rescue shelters.",
        documents: [
          { name: "501c3_Determination_Letter.pdf", url: "https://example.com/docs/501c3.pdf", verifiedAt: "2026-01-15T12:00:00.000Z" }
        ]
      },
      avatar: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-01-15T11:00:00.000Z"
    },
    {
      id: "usr_charity_3",
      name: "Lifeline Medical Outreach",
      email: "help@lifelinemed.org",
      password: defaultPasswordHash,
      role: "charity",
      organization: {
        legalName: "Lifeline Medical Outreach NGO",
        registrationNumber: "MED-NGO-2024-5541",
        country: "United Kingdom",
        city: "London",
        taxExemptId: "GB-88492010",
        verificationStatus: "pending",
        website: "https://lifelinemed.org",
        phone: "+44 20 7946 0912",
        bio: "Providing critical pediatric surgeries, mobile clinics, and subsidized medicines for underprivileged families.",
        documents: [
          { name: "Charity_Commission_Proof.pdf", url: "https://example.com/docs/ukcharity.pdf", verifiedAt: null }
        ]
      },
      avatar: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-02-01T14:30:00.000Z"
    },
    {
      id: "usr_donor_1",
      name: "Sarah Connor",
      email: "sarah.connor@example.com",
      password: defaultPasswordHash,
      role: "donor",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      phone: "+1 555-0199",
      createdAt: "2026-01-20T08:15:00.000Z"
    },
    {
      id: "usr_donor_2",
      name: "Rajesh Sharma",
      email: "rajesh.sharma@example.com",
      password: defaultPasswordHash,
      role: "donor",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      phone: "+91 99887 66554",
      createdAt: "2026-02-05T10:20:00.000Z"
    },
    {
      id: "usr_volunteer_1",
      name: "Alex Rivera",
      email: "alex.rivera@example.com",
      password: defaultPasswordHash,
      role: "volunteer",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      skills: ["First Aid", "Teaching", "Event Organizing", "Driving"],
      bio: "Passionate environmentalist and weekend community tutor.",
      phone: "+1 (555) 432-8765",
      createdAt: "2026-01-25T16:45:00.000Z"
    }
  ];

  const campaigns = [
    {
      id: "cmp_edu_01",
      title: "Support Children's Education in Rural Schools",
      tagline: "Provide quality books, digital tablets, and classroom benches to 500 underprivileged kids.",
      description: "Education is the greatest equalizer. In several remote villages, children study sitting on damp floors with outdated textbooks shared between five students. This campaign provides comprehensive educational kits, smart digital learning screens, solar-powered lamps for nighttime studying, and teacher training. Your support bridges the rural-urban digital divide and empowers girls and boys to pursue higher education and break generational poverty cycles.",
      category: "Education",
      targetAmount: 500000,
      raisedAmount: 365000,
      donorCount: 142,
      currency: "INR",
      location: "Rajasthan & Bihar, India",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80"
      ],
      organizationId: "usr_charity_1",
      organizationName: "Hope Global Foundation",
      isVerified: true,
      status: "active", // active | completed | paused
      featured: true,
      urgent: false,
      matchingDonorPledge: "Google Grants matches $1 for every $2 donated!",
      impactMetrics: [
        { label: "Children Impacted", value: "500+" },
        { label: "Schools Supported", value: "12" },
        { label: "Digital Tablets Supplied", value: "85" }
      ],
      endDate: "2026-11-30T23:59:59.000Z",
      createdAt: "2026-01-12T10:00:00.000Z"
    },
    {
      id: "cmp_food_02",
      title: "Community Food Drive & Hunger Relief",
      tagline: "Emergency food rations and hot nutritious meals for 2,000 homeless and daily-wage families.",
      description: "No child should go to bed hungry. Through our community kitchen vans and food delivery hubs, we supply fresh lentils, rice, fortified oil, flour, and fresh vegetables directly to low-income settlements and homeless shelters. Each nutrition pack feeds a family of four for two full weeks with wholesome, balanced nourishment.",
      category: "Food",
      targetAmount: 300000,
      raisedAmount: 245000,
      donorCount: 98,
      currency: "INR",
      location: "New Delhi & Mumbai, India",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80"
      ],
      organizationId: "usr_charity_1",
      organizationName: "Hope Global Foundation",
      isVerified: true,
      status: "active",
      featured: true,
      urgent: true,
      matchingDonorPledge: "Anonymous Corporate Donor is 100% matching this weekend's gifts!",
      impactMetrics: [
        { label: "Meals Served", value: "24,000" },
        { label: "Families Sustained", value: "1,200" },
        { label: "Distribution Hubs", value: "6" }
      ],
      endDate: "2026-09-15T23:59:59.000Z",
      createdAt: "2026-01-20T12:00:00.000Z"
    },
    {
      id: "cmp_env_03",
      title: "Reforestation & Native Habitat Restoration",
      tagline: "Plant 25,000 native trees to restore degraded forest corridors and fight climate change.",
      description: "Forests are the lungs of our planet and the haven for endangered biodiversity. We work hand-in-hand with local indigenous rangers to plant native broadleaf and fruit trees, establish drip-irrigation sapling nurseries, and protect water catchment basins against soil erosion.",
      category: "Environment",
      targetAmount: 750000,
      raisedAmount: 512000,
      donorCount: 210,
      currency: "INR",
      location: "Pacific Northwest & Western Ghats",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80"
      ],
      organizationId: "usr_charity_2",
      organizationName: "GreenEarth Conservation Initiative",
      isVerified: true,
      status: "active",
      featured: false,
      urgent: false,
      matchingDonorPledge: null,
      impactMetrics: [
        { label: "Trees Planted", value: "17,500" },
        { label: "Acres Protected", value: "450" },
        { label: "CO2 Offset / Yr", value: "350 Tons" }
      ],
      endDate: "2026-12-31T23:59:59.000Z",
      createdAt: "2026-02-01T08:00:00.000Z"
    },
    {
      id: "cmp_health_04",
      title: "Emergency Pediatric Surgeries for Heart Conditions",
      tagline: "Save the lives of 30 newborns with congenital heart defects from low-income families.",
      description: "Congenital heart disease is treatable when operated on in early infancy, but the exorbitant hospital expenses leave indigent parents helpless. Lifeline Medical Outreach collaborates with premier cardiac surgery institutes to sponsor 100% of surgery costs, post-op ICU care, and medication for babies in desperate need.",
      category: "Healthcare",
      targetAmount: 1200000,
      raisedAmount: 890000,
      donorCount: 340,
      currency: "INR",
      location: "London, UK & Global Partners",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80"
      ],
      organizationId: "usr_charity_3",
      organizationName: "Lifeline Medical Outreach",
      isVerified: false, // Verification pending
      status: "active",
      featured: true,
      urgent: true,
      matchingDonorPledge: "Medical Trust Matching Fund active up to ₹5,00,000",
      impactMetrics: [
        { label: "Surgeries Funded", value: "22" },
        { label: "Success Rate", value: "98.5%" },
        { label: "Recovery Support", value: "1 Year" }
      ],
      endDate: "2026-10-15T23:59:59.000Z",
      createdAt: "2026-02-10T11:00:00.000Z"
    },
    {
      id: "cmp_animals_05",
      title: "Rescue & Shelter for Abandoned Animals",
      tagline: "Medical rescue, shelter renovation, and daily feed for 300 injured stray animals.",
      description: "Our animal rescue haven takes in injured, abandoned, and distressed dogs, cats, and injured birds. We provide round-the-clock veterinary ambulance service, sterilization surgeries, rehabilitation therapy, and foster care adoptions.",
      category: "Animals",
      targetAmount: 250000,
      raisedAmount: 250000,
      donorCount: 115,
      currency: "INR",
      location: "Bengaluru, India",
      image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80"
      ],
      organizationId: "usr_charity_2",
      organizationName: "GreenEarth Conservation Initiative",
      isVerified: true,
      status: "completed", // 100% funded!
      featured: false,
      urgent: false,
      matchingDonorPledge: null,
      impactMetrics: [
        { label: "Animals Rescued", value: "320" },
        { label: "Adoptions Finalized", value: "118" }
      ],
      endDate: "2026-08-01T23:59:59.000Z",
      createdAt: "2026-01-05T09:30:00.000Z"
    },
    {
      id: "cmp_disaster_06",
      title: "Flood Relief & Clean Drinking Water Kits",
      tagline: "Rapid response clean water filtration units and emergency kits for flood-stricken villages.",
      description: "Devastating flash floods have cut off clean water and washed away homes. Stagnant floodwaters lead to rapid cholera and waterborne illness outbreaks. We deploy portable gravity water filter units and tarpaulin shelters within 24 hours of disaster notice.",
      category: "Disaster Relief",
      targetAmount: 800000,
      raisedAmount: 430000,
      donorCount: 165,
      currency: "INR",
      location: "Assam & Coastal Regions",
      image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80"
      ],
      organizationId: "usr_charity_1",
      organizationName: "Hope Global Foundation",
      isVerified: true,
      status: "active",
      featured: true,
      urgent: true,
      matchingDonorPledge: "Emergency Relief Alliance 2X matching active",
      impactMetrics: [
        { label: "Water Units Deployed", value: "340" },
        { label: "People Given Clean Water", value: "15,000" }
      ],
      endDate: "2026-09-30T23:59:59.000Z",
      createdAt: "2026-02-15T07:15:00.000Z"
    }
  ];

  const donations = [
    {
      id: "don_984210",
      receiptNumber: "REC-2026-98421",
      donorId: "usr_donor_1",
      donorName: "Sarah Connor",
      donorEmail: "sarah.connor@example.com",
      donorPhone: "+1 555-0199",
      campaignId: "cmp_edu_01",
      campaignTitle: "Support Children's Education in Rural Schools",
      organizationId: "usr_charity_1",
      organizationName: "Hope Global Foundation",
      amount: 5000,
      tipAmount: 250,
      totalPaid: 5250,
      currency: "INR",
      paymentMethod: "Stripe Card (Simulated)",
      paymentStatus: "completed",
      transactionId: "txn_sim_stripe_9842108849",
      isRecurring: false,
      frequency: "one-time",
      isAnonymous: false,
      dedication: {
        type: "in_honor_of",
        name: "My Grandparents"
      },
      donorMessage: "Proud to support quality education for all young minds!",
      taxDeductible: true,
      taxExemptionCode: "Section 80G - 50% Tax Relief",
      createdAt: "2026-02-14T11:24:00.000Z"
    },
    {
      id: "don_984211",
      receiptNumber: "REC-2026-98422",
      donorId: "usr_donor_1",
      donorName: "Sarah Connor",
      donorEmail: "sarah.connor@example.com",
      donorPhone: "+1 555-0199",
      campaignId: "cmp_food_02",
      campaignTitle: "Community Food Drive & Hunger Relief",
      organizationId: "usr_charity_1",
      organizationName: "Hope Global Foundation",
      amount: 2500,
      tipAmount: 100,
      totalPaid: 2600,
      currency: "INR",
      paymentMethod: "Razorpay UPI (Simulated)",
      paymentStatus: "completed",
      transactionId: "txn_sim_rzp_7749201948",
      isRecurring: true,
      frequency: "monthly",
      isAnonymous: false,
      dedication: null,
      donorMessage: "Monthly nourishment support for the community drive.",
      taxDeductible: true,
      taxExemptionCode: "Section 80G - 50% Tax Relief",
      createdAt: "2026-02-18T14:10:00.000Z"
    },
    {
      id: "don_984212",
      receiptNumber: "REC-2026-98423",
      donorId: "usr_donor_2",
      donorName: "Rajesh Sharma",
      donorEmail: "rajesh.sharma@example.com",
      donorPhone: "+91 99887 66554",
      campaignId: "cmp_edu_01",
      campaignTitle: "Support Children's Education in Rural Schools",
      organizationId: "usr_charity_1",
      organizationName: "Hope Global Foundation",
      amount: 10000,
      tipAmount: 500,
      totalPaid: 10500,
      currency: "INR",
      paymentMethod: "NetBanking (Simulated)",
      paymentStatus: "completed",
      transactionId: "txn_sim_netb_3391827461",
      isRecurring: false,
      frequency: "one-time",
      isAnonymous: false,
      dedication: {
        type: "in_memory_of",
        name: "Late Dr. K. Sharma"
      },
      donorMessage: "Education is the key to empowerment. Keep up the wonderful work!",
      taxDeductible: true,
      taxExemptionCode: "Section 80G - 50% Tax Relief",
      createdAt: "2026-02-20T09:45:00.000Z"
    }
  ];

  const volunteerOpportunities = [
    {
      id: "vol_opp_01",
      title: "Weekend Community Food Drive Volunteers",
      organizationId: "usr_charity_1",
      organizationName: "Hope Global Foundation",
      campaignId: "cmp_food_02",
      campaignTitle: "Community Food Drive & Hunger Relief",
      location: "Community Center, Sector 15, New Delhi",
      date: "2026-09-12",
      time: "09:00 AM - 02:00 PM",
      spotsNeeded: 20,
      spotsFilled: 12,
      skillsRequired: ["Food Packing", "Logistics", "Community Greeting"],
      description: "Join us this Saturday to pack 1,000 dry ration kits and assist in loading our neighborhood distribution vans. Refreshments and certificate of participation provided.",
      status: "open",
      createdAt: "2026-02-01T10:00:00.000Z"
    },
    {
      id: "vol_opp_02",
      title: "Rural School Tablet & Library Setup Mentor",
      organizationId: "usr_charity_1",
      organizationName: "Hope Global Foundation",
      campaignId: "cmp_edu_01",
      campaignTitle: "Support Children's Education in Rural Schools",
      location: "Rural Learning Hub, Alwar District",
      date: "2026-09-20",
      time: "10:00 AM - 04:00 PM",
      spotsNeeded: 10,
      spotsFilled: 6,
      skillsRequired: ["Basic Tech Skills", "Teaching Kids", "Storytelling"],
      description: "Help unbox and configure 50 educational Android tablets, setup the digital classroom, and conduct an introductory learning session for grades 4 to 8 students.",
      status: "open",
      createdAt: "2026-02-05T15:00:00.000Z"
    },
    {
      id: "vol_opp_03",
      title: "Tree Planting & Nursery Caretaker Day",
      organizationId: "usr_charity_2",
      organizationName: "GreenEarth Conservation Initiative",
      campaignId: "cmp_env_03",
      campaignTitle: "Reforestation & Native Habitat Restoration",
      location: "Eco Park Sanctuary & River Basin",
      date: "2026-09-27",
      time: "07:30 AM - 12:30 PM",
      spotsNeeded: 35,
      spotsFilled: 22,
      skillsRequired: ["Gardening", "Physical Stamina", "Enthusiasm for Nature"],
      description: "Plant native saplings, prepare organic compost beds, and install bamboo protective fencing. Gloves and tools provided on-site!",
      status: "open",
      createdAt: "2026-02-12T11:30:00.000Z"
    }
  ];

  const volunteerApplications = [
    {
      id: "app_vol_01",
      opportunityId: "vol_opp_01",
      opportunityTitle: "Weekend Community Food Drive Volunteers",
      volunteerId: "usr_volunteer_1",
      volunteerName: "Alex Rivera",
      volunteerEmail: "alex.rivera@example.com",
      volunteerPhone: "+1 (555) 432-8765",
      organizationId: "usr_charity_1",
      status: "approved", // pending | approved | rejected | completed
      availability: "Available full day Saturday, have reliable transport.",
      experienceNote: "Previous volunteer lead with Red Cross food distribution drives.",
      appliedAt: "2026-02-10T14:20:00.000Z",
      reviewedAt: "2026-02-11T09:15:00.000Z"
    },
    {
      id: "app_vol_02",
      opportunityId: "vol_opp_03",
      opportunityTitle: "Tree Planting & Nursery Caretaker Day",
      volunteerId: "usr_volunteer_1",
      volunteerName: "Alex Rivera",
      volunteerEmail: "alex.rivera@example.com",
      volunteerPhone: "+1 (555) 432-8765",
      organizationId: "usr_charity_2",
      status: "pending",
      availability: "Can arrive by 7:30 AM sharp.",
      experienceNote: "Avid tree planter with 20+ hours logged.",
      appliedAt: "2026-02-22T18:00:00.000Z",
      reviewedAt: null
    }
  ];

  const campaignUpdates = [
    {
      id: "upd_01",
      campaignId: "cmp_edu_01",
      organizationId: "usr_charity_1",
      title: "Milestone Reached: 150 Children Received New Books & Solar Lamps!",
      content: "Thanks to the tremendous generosity of 142 donors, we have successfully delivered our first batch of curriculum books, school bags, and solar study lamps to 150 eager young students in the Alwar learning circle. Their smiles and enthusiasm are beyond inspiring! We are now 73% towards our total goal—₹1,35,000 remaining to equip the full digital classroom!",
      images: [
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80"
      ],
      createdAt: "2026-02-16T15:30:00.000Z"
    },
    {
      id: "upd_02",
      campaignId: "cmp_food_02",
      organizationId: "usr_charity_1",
      title: "Weekend Kitchen Vans Dispatched - 1,200 Hot Meals Served",
      content: "Our volunteer cooks and drivers worked through the weekend to prepare and deliver steaming wholesome khichdi, lentils, and vegetable curries across 3 temporary relief shelters. A huge thank you to everyone who chipped in this month!",
      images: [
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80"
      ],
      createdAt: "2026-02-19T18:00:00.000Z"
    }
  ];

  const notifications = [
    {
      id: "notif_01",
      userId: "usr_donor_1",
      title: "Donation Confirmed & Tax Receipt Generated",
      message: "Thank you for your generous gift of ₹5,000 to 'Support Children's Education'. Your official receipt REC-2026-98421 is ready to download.",
      type: "donation_success",
      link: "/receipt/REC-2026-98421",
      isRead: false,
      createdAt: "2026-02-14T11:24:00.000Z"
    },
    {
      id: "notif_02",
      userId: "usr_donor_1",
      title: "New Campaign Update Posted!",
      message: "Hope Global Foundation posted an update: '150 Children Received New Books & Solar Lamps!' for a campaign you supported.",
      type: "campaign_update",
      link: "/campaigns/cmp_edu_01",
      isRead: false,
      createdAt: "2026-02-16T15:30:00.000Z"
    },
    {
      id: "notif_03",
      userId: "usr_volunteer_1",
      title: "Volunteer Application Approved! 🎉",
      message: "Hope Global Foundation has approved your application for 'Weekend Community Food Drive Volunteers'. We look forward to seeing you!",
      type: "volunteer_approved",
      link: "/dashboard/volunteer",
      isRead: true,
      createdAt: "2026-02-11T09:15:00.000Z"
    }
  ];

  return {
    users,
    campaigns,
    donations,
    volunteerOpportunities,
    volunteerApplications,
    campaignUpdates,
    notifications
  };
};
