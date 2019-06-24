import React from 'react'
import { Tag, Intent, Card, Elevation } from '@blueprintjs/core'
import { Flex, Box } from 'reflexbox'
import { getCodeForName } from './iso3166.js'

function SelectableCarCardList (props) {
  const cars = props.cars
  if (cars === undefined ||
    cars === null ||
    Object.keys(cars).length === 0
  ) return null

  let tags

  return (
    <React.Fragment>
      {Object.keys(cars).map((startNum) => {
        if (cars[startNum] === undefined) return null
        let code = getCodeForName(cars[startNum].country)
        if (cars[startNum].races) {
          tags = cars[startNum].races.map(
            (tag) => <Tag
              key={tag}
              round
              intent={Intent.PRIMARY}
              className={'pwd-racetag'}
            >{tag}</Tag>)
        } else {
          tags = ''
        }
        return (
          <Box w={1 / props.columns} p={1} key={'pool-' + cars[startNum].rf}>
            <Card className={'card-tight'}
              elevation={Elevation.TWO}
              id={'pool-' + cars[startNum].rf}
              interactive
              onClick={props.addClickHandler}>
              <Flex w={1} p={0} justify={'space-between'}>
                <Flex w={9 / 10}>
                  <Box>
                    <i className={'flag-icons ' + code} />
                  </Box>
                  <Box px={1}>
                    <strong>{cars[startNum].name}</strong>
                    <div>{cars[startNum].rf}</div>
                    <div>{tags}</div>
                  </Box>
                </Flex>
              </Flex>
            </Card>
          </Box>
        )
      })}
    </React.Fragment>
  )
}

export default SelectableCarCardList
