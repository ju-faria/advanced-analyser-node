import {
  lerpLog,
  inverseLerpLog,
  lerp,
  inverseLerp,
  remap,
  clamp,
} from './'


describe('utils', () => {
  describe('lerpLog', () => {
    it('should return expected values', () => {
      expect(lerpLog(100, 1000, 1)).toBeCloseTo(1000);
      expect(lerpLog(100, 1000, 0)).toBeCloseTo(100);
      expect(lerpLog(100, 1000, 0.5)).toBeCloseTo(316.22776601683785);
    });
  })

  describe('inverseLerpLog', () => {
    it('should return expected values', () => {
      expect(inverseLerpLog(100, 1000, 1000)).toBeCloseTo(1);
      expect(inverseLerpLog(100, 1000, 100)).toBeCloseTo(0);
      expect(inverseLerpLog(100, 1000, 316.22776601683785)).toBeCloseTo(0.5);
    });
  });

  describe('lerp', () => {
    it('should return expected values', () => {
      expect(lerp(100, 1000, 1)).toBeCloseTo(1000);
      expect(lerp(100, 1000, 0)).toBeCloseTo(100);
      expect(lerp(100, 1000, 0.5)).toBeCloseTo(550);
    });
  });

  describe('inverseLerp', () => {
    it('should return expected values', () => {
      expect(inverseLerp(100, 1000, 1000)).toBeCloseTo(1);
      expect(inverseLerp(100, 1000, 100)).toBeCloseTo(0);
      expect(inverseLerp(100, 1000, 550)).toBeCloseTo(0.5);
    });
  });

  describe('remap', () => {
    it('should return expected values', () => {
      expect(remap(100, 1000, 200, 2000, 100)).toBeCloseTo(200)
      expect(remap(100, 1000, 200, 2000, 200)).toBeCloseTo(400)
      expect(remap(100, 1000, 200, 2000, 1000)).toBeCloseTo(2000)
    });
  });

  describe('clamp', () => {
    it('should return expected values', () => {
      expect(clamp(10, 20, 100)).toBe(20);
      expect(clamp(25, 20, 100)).toBe(25);
      expect(clamp(200, 20, 100)).toBe(100);
    });
  })
})
