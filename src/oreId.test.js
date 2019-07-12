import OreId from './oreId';

describe('OreId', () => {
  let oreId;
  const options = {
    appId: 'test_id',
    apiKey: 'test_key',
    oreIdUrl: 'test'
  };

  beforeEach(() => {
    oreId = new OreId(options);
  });

  it('Doesnt crash', () => {
    expect(oreId).toBeTruthy();
  });
});
