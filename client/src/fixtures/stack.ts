import {labeledButton, surface} from './stack-helpers';
import type {Fixture} from './types';

/** Base fixture: a static ChildList (array of ids) in a default (vertical) Stack. */
export const stackFixture: Fixture = {
  name: 'stack',
  messages: surface('stack', [
    {id: 'root', component: 'Stack', children: ['b1', 'b2', 'b3']},
    ...labeledButton('b1', 'One'),
    ...labeledButton('b2', 'Two'),
    ...labeledButton('b3', 'Three'),
  ]),
};
