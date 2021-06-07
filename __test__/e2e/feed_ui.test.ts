// /**
//  * @jest-environment puppeteer
//  */
xdescribe('On Deck Toy News Feed', () => {
  
    beforeAll(async () => {
      // So of course dev server must be running
      await page.goto('http://localhost:3000/');
    });
  
    // disabled because of weird bug. just an example would fix IRL
    it('News Feed Displays', async () => {
      await page
        .waitForSelector('.infinite-scroll-component')
        .then(() => console.log('got it'));
    });


    /// IRL here you could test for components and differnt situations
    // for instance that only writer stuff shows up for writers
});

export {}