import React from 'react';
import { Tag, Intent, Card, Elevation } from '@blueprintjs/core';
import { Flex, Box } from 'reflexbox';
import { getCodeForName } from './iso3166.js';

function CarCardList (props) {
  const cars = props.cars;
  if (cars === undefined ||
    cars === null ||
    cars.length === 0
  ) return null;

  let tags;

  return (
    <React.Fragment>
      {cars.map((car) => {
        const code = getCodeForName(car[2]);
        if (car[3]) {
          tags = car[3].map(
            (tag) => <Tag
              key={tag}
              round
              intent={Intent.PRIMARY}
              className={'pwd-racetag'}
            >{tag}</Tag>);
        } else {
          tags = '';
        }
        return (
          <Box p={1} w={props.columns === 2 ? 1 / 2 : 1 / 3} key={car[0]}>
            <Card elevation={Elevation.TWO}
              id={car[0]}
              interactive
              onClick={props.carClickHandler}>
              <Flex w={1} p={0}>
                <Box>
                  <i className={'flag-icons ' + code} />
                </Box>
                <Box px={1}>
                  <strong>{car[1]}</strong>
                  <p>{car[2]}</p>
                  <p>{car[0]}</p>
                  <div>{tags}</div>
                </Box>
              </Flex>
            </Card>
          </Box>
        );
      })}
    </React.Fragment>
  );
}

export default CarCardList;
