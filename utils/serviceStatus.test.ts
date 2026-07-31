import { getServiceStatus } from "./serviceStatus";

function runTests() {
  console.log("Running serviceStatus utility tests...\n");

  const testCases = [
    {
      // 1st Wednesday of June 2026
      date: new Date(2026, 5, 3), // June 3, 2026 (Wednesday)
      expectedText: "Join Live",
      expectedHasLink: true,
      description: "1st Wednesday (June 3, 2026)",
    },
    {
      // 2nd Wednesday of June 2026
      date: new Date(2026, 5, 10), // June 10, 2026 (Wednesday)
      expectedText: "Join Live",
      expectedHasLink: true,
      description: "2nd Wednesday (June 10, 2026)",
    },
    {
      // 3rd Wednesday of June 2026
      date: new Date(2026, 5, 17), // June 17, 2026 (Wednesday)
      expectedText: "Join Live",
      expectedHasLink: true,
      description: "3rd Wednesday (June 17, 2026)",
    },
    {
      // 4th Wednesday of June 2026
      date: new Date(2026, 5, 24), // June 24, 2026 (Wednesday)
      expectedText: "Face to Face",
      expectedHasLink: false,
      description: "4th Wednesday (June 24, 2026)",
    },
    {
      // 5th Wednesday of July 2026
      date: new Date(2026, 6, 29), // July 29, 2026 (Wednesday)
      expectedText: "Join Live",
      expectedHasLink: true,
      description: "5th Wednesday (July 29, 2026)",
    },
    {
      // A Sunday
      date: new Date(2026, 5, 21), // June 21, 2026 (Sunday)
      expectedText: "Face to Face",
      expectedHasLink: false,
      description: "A Sunday (June 21, 2026)",
    },
    {
      // A Monday
      date: new Date(2026, 5, 22), // June 22, 2026 (Monday)
      expectedText: "Face to Face",
      expectedHasLink: false,
      description: "A Monday (June 22, 2026)",
    },
  ];

  let passedCount = 0;

  for (const tc of testCases) {
    const result = getServiceStatus(tc.date);
    const hasLink = result.link !== "";

    const textMatch = result.text === tc.expectedText;
    const linkMatch = hasLink === tc.expectedHasLink;

    if (textMatch && linkMatch) {
      console.log(`✅ PASS: ${tc.description}`);
      passedCount++;
    } else {
      console.error(`❌ FAIL: ${tc.description}`);
      console.error(`   Expected text: "${tc.expectedText}", got: "${result.text}"`);
      console.error(`   Expected has link: ${tc.expectedHasLink}, got link: "${result.link}"`);
    }
  }

  console.log(`\nTests completed: ${passedCount}/${testCases.length} passed.`);
  if (passedCount !== testCases.length) {
    process.exit(1);
  }
}

runTests();
