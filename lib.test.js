import {updateTags} from './lib';

const dataset = [
  [
    'foo|bar Bruce Wayne bar|foo',
    [{name: 'Bruce Wayne', offset: 7, length: 11}],
    [{start: 3, end: 22}, {start: 3, end: 3}],
    [],
  ],
  [
    'foo |Bruce Wayne| bar',
    [{name: 'Bruce Wayne', offset: 4, length: 11}],
    [{start: 4, end: 15}, {start: 4, end: 4}],
    [],
  ],
  [
    '|foo Bruce| Wayne bar',
    [{name: 'Bruce Wayne', offset: 4, length: 11}],
    [{start: 0, end: 9}, {start: 0, end: 0}],
    [],
  ],
  [
    'foo Bru|ce Way|ne bar',
    [{name: 'Bruce Wayne', offset: 4, length: 11}],
    [{start: 7, end: 13}, {start: 7, end: 7}],
    [],
  ],
  [
    'Bruce Wayne |foobar|',
    [{name: 'Bruce Wayne', offset: 0, length: 11}],
    [{start: 19, end: 13}, {start: 13, end: 13}],
    [{name: 'Bruce Wayne', offset: 0, length: 11}],
  ],
  [
    '|foobar| Bruce Wayne',
    [{name: 'Bruce Wayne', offset: 7, length: 11}],
    [{start: 0, end: 6}, {start: 0, end: 0}],
    [{name: 'Bruce Wayne', offset: 1, length: 11}],
  ],
  [
    'foobar Bruce| Wayne|',
    [{name: 'Bruce Wayne', offset: 7, length: 11}],
    [{start: 12, end: 18}, {start: 12, end: 12}],
    [{name: 'Bruce', offset: 7, length: 5}],
  ],
  [
    'foo Bruce| Wayne bar|',
    [{name: 'Bruce Wayne', offset: 7, length: 11}],
    [{start: 12, end: 22}, {start: 12, end: 12}],
    [{name: 'Bruce', offset: 7, length: 5}],
  ],
];

describe('Utilities', () => {
  test.each(dataset)('%s', (sample, tags, selections, expected) => {
    const actual = updateTags(tags, selections);

    expect(actual).toMatchObject(expected);
  });
});
