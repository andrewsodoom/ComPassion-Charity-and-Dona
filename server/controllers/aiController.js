export const generateCampaignStory = (req, res) => {
  try {
    const { title, category = 'Education', causeDetails = '', targetBeneficiaries = 'Children & families in need' } = req.body;

    const templates = {
      Education: {
        tagline: `Empower ${targetBeneficiaries} with education, learning tools, and a brighter tomorrow.`,
        story: `Across marginalized neighborhoods, children dream of learning, creating, and unlocking a better future. However, the lack of basic textbooks, desks, and electricity holds their aspirations hostage.\n\nThrough this project, we are supplying comprehensive educational kits, digital learning tablets, and trained mentors to directly impact ${targetBeneficiaries}. Every child deserves an equal seat at the table of opportunity.\n\nYour contribution does not just buy a textbook; it ignites hope, builds lifelong confidence, and helps families break free from cycles of generational hardship.`,
        impactMetrics: [
          { label: "Students Impacted", value: "350+" },
          { label: "Classrooms Equipped", value: "8" },
          { label: "Mentorship Hours", value: "500+" }
        ],
        fundAllocation: [
          { item: "Learning Kits & Books", percent: "45%" },
          { item: "Digital Tablets & Hardware", percent: "35%" },
          { item: "Teacher Training & Logistics", percent: "20%" }
        ]
      },
      Healthcare: {
        tagline: `Provide lifesaving medical treatments and emergency care to ${targetBeneficiaries}.`,
        story: `Medical emergencies often push vulnerable families into extreme poverty. When treatments are unaffordable, parents are forced to make impossible choices between essential medicine and basic survival.\n\nOur healthcare mission covers critical surgery costs, pediatric emergency ICU care, vital prescription medicines, and transportation for ${targetBeneficiaries}.\n\nBy joining hands with our clinical partners, 100% of your contributions go straight into medical relief and patient recovery. Together, we can restore health and save lives.`,
        impactMetrics: [
          { label: "Patients Treated", value: "200+" },
          { label: "Surgeries Sponsored", value: "15" },
          { label: "Medical Camps", value: "6" }
        ],
        fundAllocation: [
          { item: "Surgical & Hospital Procedures", percent: "55%" },
          { item: "Prescription Medicines & Diagnostics", percent: "30%" },
          { item: "Post-Op Follow-up Care", percent: "15%" }
        ]
      },
      Food: {
        tagline: `Deliver fresh, nutritious meals and emergency groceries to hungry families.`,
        story: `Hunger is a daily crisis for thousands of daily-wage workers, homeless elders, and orphaned children. Malnutrition impairs childhood growth and drains dignity.\n\nOur community relief kitchens and food dispatch vans provide nutrient-rich, hygienic hot meals and dry ration packs containing rice, lentils, oil, and flour to sustain ${targetBeneficiaries}.\n\nEvery small gift puts warm food on the table for someone who went without yesterday. Let's ensure no one sleeps hungry.`,
        impactMetrics: [
          { label: "Meals Distributed", value: "15,000" },
          { label: "Ration Kits", value: "800" },
          { label: "Distribution Vans", value: "4" }
        ],
        fundAllocation: [
          { item: "Raw Grains, Lentils & Produce", percent: "60%" },
          { item: "Kitchen Preparation & Fuel", percent: "25%" },
          { item: "Packaging & Delivery Logistics", percent: "15%" }
        ]
      },
      Environment: {
        tagline: `Restore fragile ecosystems, plant native trees, and protect clean water resources.`,
        story: `Climate change and deforestation threaten our ecosystems, native wildlife, and agricultural water tables. Immediate ground-level action is essential.\n\nWe collaborate with local community stewards to plant diverse native saplings, install clean solar water pumps, and protect green forest corridors.\n\nYour support fosters sustainable biodiversity, sequesters carbon, and leaves a thriving green legacy for generations to come.`,
        impactMetrics: [
          { label: "Native Trees Planted", value: "10,000" },
          { label: "Acres Protected", value: "150" },
          { label: "CO2 Offset / Yr", value: "120 Tons" }
        ],
        fundAllocation: [
          { item: "Saplings & Organic Compost", percent: "40%" },
          { item: "Drip Irrigation & Soil Prep", percent: "35%" },
          { item: "Ranger Care & Field Monitoring", percent: "25%" }
        ]
      },
      Animals: {
        tagline: `Rescue, treat, and provide lifelong shelter to abandoned and injured animals.`,
        story: `Stray and abandoned animals suffer silently from vehicular accidents, starvation, and lack of medical attention on city streets.\n\nOur sanctuary provides 24/7 rescue ambulances, surgical care, rabies vaccinations, sterilization, and warm foster shelters for injured and stray animals.\n\nEvery tail wag and gentle purr is proof that compassion transforms lives. Join us in being a voice for the voiceless.`,
        impactMetrics: [
          { label: "Animals Rescued", value: "250" },
          { label: "Treatments Administered", value: "450" },
          { label: "Safe Adoptions", value: "80" }
        ],
        fundAllocation: [
          { item: "Veterinary Surgeries & Meds", percent: "50%" },
          { item: "Daily Nutritional Feed", percent: "30%" },
          { item: "Shelter Heating & Sanitation", percent: "20%" }
        ]
      },
      "Disaster Relief": {
        tagline: `Rapid emergency shelter, clean water filters, and survival supplies for disaster survivors.`,
        story: `When natural disasters strike, families lose everything in minutes. Immediate first-response assistance is the difference between survival and despair.\n\nOur rapid disaster relief teams deploy emergency waterproof tents, portable gravity water filters, hygiene kits, and thermal blankets directly to ground zero.\n\nYour rapid aid enables us to deploy resources within hours of an emergency.`,
        impactMetrics: [
          { label: "Emergency Kits Deployed", value: "1,200" },
          { label: "Survivors Sheltered", value: "4,500" },
          { label: "Water Filtration Kits", value: "250" }
        ],
        fundAllocation: [
          { item: "Emergency Tents & Tarpaulins", percent: "40%" },
          { item: "Water Purifiers & First Aid", percent: "35%" },
          { item: "Rapid Transit & Distribution", percent: "25%" }
        ]
      }
    };

    const selected = templates[category] || templates['Education'];

    res.json({
      success: true,
      generated: {
        title: title || `Urgent: Support for ${category} Relief Initiatives`,
        tagline: selected.tagline,
        description: causeDetails ? `${selected.story}\n\nSpecific Project Details: ${causeDetails}` : selected.story,
        impactMetrics: selected.impactMetrics,
        fundAllocation: selected.fundAllocation,
        suggestedGoal: category === 'Healthcare' ? 1000000 : 500000
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'AI story generation failed', error: err.message });
  }
};

export const generateCampaignSummary = (req, res) => {
  try {
    const { title, description, category, raisedAmount, targetAmount } = req.body;

    const percent = targetAmount > 0 ? Math.round((raisedAmount / targetAmount) * 100) : 0;

    const takeaways = [
      `🎯 Mission: ${title || 'Empowering vulnerable communities with targeted aid.'}`,
      `📊 Current Status: Raised ${percent}% towards the goal with verified charity oversight.`,
      `✨ Immediate Impact: Direct funding towards verified ${category || 'charity'} programs with downloadable tax receipts.`
    ];

    res.json({
      success: true,
      takeaways,
      summaryText: `This campaign focuses on ${category || 'community relief'}. With ${percent}% of its goal achieved, every contribution directly accelerates field operations with complete fiscal transparency.`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to generate AI summary' });
  }
};

export const estimateImpact = (req, res) => {
  try {
    const { amount = 1000, currency = 'INR', category = 'Education' } = req.body;
    const val = Number(amount);

    let impactStatement = '';
    if (currency === 'INR') {
      if (val < 1000) {
        impactStatement = `Feeds 15 people with wholesome warm meals or provides 2 school stationery packs.`;
      } else if (val < 5000) {
        impactStatement = `Sponsors 1 month of tuition and school supplies for 2 underprivileged children.`;
      } else if (val < 20000) {
        impactStatement = `Funds comprehensive digital tablet kit, books, and solar study lamp for 5 students.`;
      } else {
        impactStatement = `Funds a major pediatric surgical procedure and 6 months of rehabilitation support.`;
      }
    } else {
      // USD / EUR / GBP
      if (val < 25) {
        impactStatement = `Provides a hygiene and warm meal kit for 5 displaced children.`;
      } else if (val < 75) {
        impactStatement = `Covers school textbooks and learning uniforms for 2 full academic semesters.`;
      } else if (val < 250) {
        impactStatement = `Equips an entire village classroom with solar-powered LED study lamps and digital tablets.`;
      } else {
        impactStatement = `Sponsors emergency specialized clinical treatment and medical recovery for an infant.`;
      }
    }

    res.json({
      success: true,
      amount: val,
      currency,
      impactStatement
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Impact calculation failed' });
  }
};
