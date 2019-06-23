import React from 'react'
import { Icon, Tag, Intent, Card, Callout, Elevation, H4 } from '@blueprintjs/core'
import { Flex, Box } from 'reflexbox'
import { getCodeForName } from './iso3166.js'

function DraggableCarCardList (props) {
  const cars = props.cars
  if (cars === undefined ||
    cars === null ||
    Object.keys(cars).length === 0
  ) return null

  return (
    <React.Fragment>
      {Object.keys(cars).map((startNum) => {
        if (cars[startNum] === undefined) return null
        let code = getCodeForName(cars[startNum].country)
        let carIntent
        if (cars[startNum].stat === 'added') {
          carIntent = Intent.PRIMARY
        } else if (cars[startNum].stat === 'removed') {
          carIntent = Intent.DANGER
        } else {
          carIntent = Intent.NONE
        }

        return (
          <Box w={1 / props.columns} p={1} key={cars[startNum].rf}>
            <Callout className={'card-tight'}
              elevation={Elevation.TWO}
              intent={carIntent}
              icon={null}
              id={cars[startNum].rf}
            >
              <Flex w={1} p={0} justify={'space-between'}>
                <Flex w={9 / 10}>
                  <Box className={'pwd-startnumber'}>
                    <H4>{startNum}</H4>
                  </Box>
                  <Box>
                    <i className={'flag-icons ' + code} />
                  </Box>
                  <Box px={1}>
                    <strong>{cars[startNum].name}</strong>
                    <div>{cars[startNum].rf}</div>
                  </Box>
                </Flex>
                <Flex w={1 / 10} p={1}>
                  <Box
                    id={cars[startNum].rf}
                    onClick={props.removeClickHandler}>
                    <Icon className={'pwd-trash'}icon={'trash'} />
                  </Box>
                </Flex>
              </Flex>
            </Callout>
          </Box>
        )
      })}
    </React.Fragment>
  )
}

export default DraggableCarCardList
