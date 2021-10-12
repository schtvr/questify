import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Card, ListItem, Button, Icon } from 'react-native-elements'

const QuestCard = (props) => {
  const { cardTitle, questList } = props
  console.log('questcard', questList)

  return (
    <View>
      <Card>
        <Card.Title>{cardTitle} </Card.Title>
        <Card.Divider/>

        { questList.map((quest, i) => {
          return (
            <View key={i} style={styles.activeQuestList}>
              <Text style={styles.name}>{quest.name}</Text>
            </View>
            );
        })}
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  activeQuestList: {

  },
  name: {
    flexDirection: 'row'
  },
})

export default QuestCard;
/*

    <Image
      style={styles.image}
      resizeMode="cover"
      source={{ uri: quest.avatar }}
    />
*/