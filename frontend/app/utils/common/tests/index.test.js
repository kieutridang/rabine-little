import { updateUrlParameter } from '../';

describe('updateUrlParameter', () => {
  it('should return updated param uri at the end', () => {
    expect(updateUrlParameter('http://domain.com/a.jpg?token=x&q=20', 'q', 30)).toEqual(
      'http://domain.com/a.jpg?token=x&q=30'
    );
  });
  it('should return updated param uri at the middle', () => {
    expect(updateUrlParameter('http://domain.com/a.jpg?token=x&q=20', 'token', 'y')).toEqual(
      'http://domain.com/a.jpg?token=y&q=20'
    );
  });
});
