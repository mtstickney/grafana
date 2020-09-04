import { toDataFrame, FieldType } from '@grafana/data';
import { getAnnotationsFromFrame } from './standardAnnotationSupport';

describe('DataFrame to annotations', () => {
  test('simple conversion', () => {
    const frame = toDataFrame({
      fields: [
        { type: FieldType.time, values: [1, 2, 3] },
        { name: 'first string field', values: ['t1', 't2', 't3'] },
        { name: 'tags', values: ['aaa,bbb', 'bbb,ccc', 'zyz'] },
      ],
    });

    const events = getAnnotationsFromFrame(frame);
    expect(events).toMatchInlineSnapshot();
  });

  test('explicit mappins', () => {
    const frame = toDataFrame({
      fields: [
        { name: 'time1', values: [100, 200, 300] },
        { name: 'time2', values: [111, 222, 333] },
        { name: 'aaaaa', values: ['a1', 'a2', 'a3'] },
        { name: 'bbbbb', values: ['b1', 'b2', 'b3'] },
      ],
    });

    const events = getAnnotationsFromFrame(frame, {
      text: { value: 'bbbbb' },
      time: { value: 'time2' },
      timeEnd: { value: 'time1' },
      title: { value: 'aaaaa' },
    });
    expect(events).toMatchInlineSnapshot(`
      Array [
        Object {
          "text": "b1",
          "time": 111,
          "timeEnd": 100,
          "title": "a1",
        },
        Object {
          "text": "b2",
          "time": 222,
          "timeEnd": 200,
          "title": "a2",
        },
        Object {
          "text": "b3",
          "time": 333,
          "timeEnd": 300,
          "title": "a3",
        },
      ]
    `);
  });
});