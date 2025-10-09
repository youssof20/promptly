#!/usr/bin/env node

/**
 * Promptly End-to-End Test Script
 * 
 * This script tests the core functionality of the Promptly application
 * to ensure everything is working correctly.
 */

import { AIService } from './src/lib/ai-service';

async function runTests() {
  console.log('🧪 Running Promptly End-to-End Tests...\n');

  const tests = [
    {
      name: 'AI Service Initialization',
      test: async () => {
        const aiService = new AIService();
        const providers = aiService.getAvailableProviders();
        console.log(`✅ Available providers: ${providers.join(', ')}`);
        return providers.length > 0;
      }
    },
    {
      name: 'Free Tier Optimization',
      test: async () => {
        const aiService = new AIService();
        const result = await aiService.optimizePrompt({
          prompt: 'help me write a blog post',
          tier: 'free'
        });
        
        console.log(`✅ Free optimization completed`);
        console.log(`   Model: ${result.model}`);
        console.log(`   Tokens: ${result.tokensUsed}`);
        console.log(`   Original: "help me write a blog post"`);
        console.log(`   Optimized: "${result.optimizedPrompt.substring(0, 100)}..."`);
        
        return result.optimizedPrompt.length > 0;
      }
    },
    {
      name: 'Pro Tier Optimization',
      test: async () => {
        const aiService = new AIService();
        const result = await aiService.optimizePrompt({
          prompt: 'create a marketing plan',
          tier: 'pro'
        });
        
        console.log(`✅ Pro optimization completed`);
        console.log(`   Model: ${result.model}`);
        console.log(`   Tokens: ${result.tokensUsed}`);
        console.log(`   Original: "create a marketing plan"`);
        console.log(`   Optimized: "${result.optimizedPrompt.substring(0, 100)}..."`);
        
        return result.optimizedPrompt.length > 0;
      }
    },
    {
      name: 'Caching Functionality',
      test: async () => {
        const aiService = new AIService();
        const prompt = 'test caching';
        
        // First call
        const start1 = Date.now();
        const result1 = await aiService.optimizePrompt({
          prompt,
          tier: 'free'
        });
        const time1 = Date.now() - start1;
        
        // Second call (should be cached)
        const start2 = Date.now();
        const result2 = await aiService.optimizePrompt({
          prompt,
          tier: 'free'
        });
        const time2 = Date.now() - start2;
        
        console.log(`✅ Caching test completed`);
        console.log(`   First call: ${time1}ms`);
        console.log(`   Second call: ${time2}ms`);
        console.log(`   Results match: ${result1.optimizedPrompt === result2.optimizedPrompt}`);
        
        return result1.optimizedPrompt === result2.optimizedPrompt && time2 < time1;
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`\n🔍 Testing: ${test.name}`);
      const result = await test.test();
      
      if (result) {
        passed++;
        console.log(`✅ PASSED: ${test.name}`);
      } else {
        failed++;
        console.log(`❌ FAILED: ${test.name}`);
      }
    } catch (error) {
      failed++;
      console.log(`❌ ERROR in ${test.name}: ${error.message}`);
    }
  }

  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log(`\n🎉 All tests passed! Promptly is ready for production.`);
  } else {
    console.log(`\n⚠️  Some tests failed. Please review the issues above.`);
  }

  return failed === 0;
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test runner error:', error);
      process.exit(1);
    });
}

export { runTests };
