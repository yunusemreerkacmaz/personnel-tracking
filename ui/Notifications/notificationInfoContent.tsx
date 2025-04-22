import React, { useEffect, useState } from 'react'
import { Avatar, Card, Chip, List, Text } from 'react-native-paper';
import { FlatList, View } from 'react-native';
import { Absentees, NotificationDto } from './Dtos/NotificationDto';

export default function NotificationInfoContent({ dto }: { dto: any }) {
  const { firstName, lastName, id, messageDto, readStatus, roleId, roleName, updateStatus, userId, userName }: NotificationDto = dto
  const [notification, setNotification] = useState<NotificationDto>(dto)

  // useEffect(() => {
  //   if (dto) {
  //     setNotification(dto); // Gelen veriyi state'e güncelle
  //   }
  // }, [dto]); // ss değiştiğinde bu useEffect tetiklenecek

  const ListofAbsentees = () => (
    <>
      <FlatList
        data={(messageDto.body as any).listofAbsentees as Absentees[]}
        keyExtractor={(item) => item.id.toString()}
        style={{marginHorizontal:10,backgroundColor:'#E1DEF1',marginVertical:10}}
        ListHeaderComponent={<Chip icon="account-remove" closeIcon={{width:20}} textStyle={{textAlign:'center',justifyContent:'center',alignItems:'center',fontSize:20,fontWeight:"bold"}} style={{ display:'flex',justifyContent:'center',alignItems:'center',backgroundColor: "#ECB1B1",height:50 }} >{messageDto.header}</Chip>}
        renderItem={({ item }) =>
          <Card elevation={5} style={{ margin: 5, borderRadius: 30, flex: 1 }}>
            <Card.Title style={{ backgroundColor: '#D3D3D3', borderTopRightRadius: 30, borderTopLeftRadius: 30, }} title={`${item.firstName} ${item.lastName}`} titleStyle={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center', opacity: 0.3,color:'black' }} />
            <Card.Content style={{ backgroundColor: '#E9D4BD', borderBottomRightRadius: 30, borderBottomStartRadius: 30, padding: 5 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{color:'black'}}>Kullanıcı id : </Text>
                <Text style={{ fontWeight: 'bold',color:'black' }}>{item.id}</Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text style={{color:'black'}}>Kullanıcı Adı : </Text>
                <Text style={{ fontWeight: 'bold',color:'black' }}>{item.userName}</Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text style={{color:'black'}}>Yetki id : </Text>
                <Text style={{ fontWeight: 'bold',color:'black' }}>{item.roleId}</Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text style={{color:'black'}}>Yetki Adı : </Text>
                <Text style={{ fontWeight: 'bold',color:'black' }}>{item.roleName}</Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text style={{color:'black'}}>Email : </Text>
                <Text style={{ fontWeight: 'bold',color:'black' }}>{item.email}</Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text style={{color:'black'}}>Cinsiyet : </Text>
                <Text style={{ fontWeight: 'bold',color:'black' }}>{item.gender}</Text>
              </View>
            </Card.Content>
          </Card>
        }
      />
    </>
  )

  const LeftContent = (props: any) => <Avatar.Icon {...props} icon="account" />

  const NotficationDefaultComponent = () => (           // şifre yenileme işlemi bunun içinde 
    <Card elevation={5} style={{ margin: 15 }}>
      <Card.Title subtitleStyle={{ opacity: 0.5, fontSize: 15 }} titleStyle={{ fontWeight: 'bold', fontSize: 20 }} title={messageDto.header} subtitle={`${firstName} ${lastName}`} left={LeftContent} />
      <Card.Content>
        <List.Section >

          <List.Item
            title={""}
            titleStyle={{ fontWeight: 'bold' }}
            left={() => <Chip icon="numeric-1-circle" style={{ backgroundColor: "#ECB1B1", width: '50%' }}>Kullanıcı id : {id}</Chip>}
          />

          <List.Item
            title={""}
            titleStyle={{ fontWeight: 'bold' }}
            left={() => <Chip icon="numeric-2-circle" style={{ backgroundColor: "#ECB1B1", width: '50%' }}>Yetki id : {id}</Chip>}
          />

          <List.Item
            title={""}
            titleStyle={{ fontWeight: 'bold' }}
            left={() => <Chip icon="numeric-3-circle" style={{ backgroundColor: "#ECB1B1", width: '50%' }}>Kullanıcı Adı : {userName}</Chip>}
          />

          <List.Item
            title={""}
            titleStyle={{ fontWeight: 'bold' }}
            left={() => <Chip icon="numeric-4-circle" style={{ backgroundColor: "#ECB1B1", width: '50%' }} >Yetki Adı : {roleName}</Chip>}
          />

          <List.Item
            title={""}
            titleStyle={{ fontWeight: 'bold' }}
            left={() => <Chip icon="numeric-5-circle" style={{ backgroundColor: "#ECB1B1", width: '50%' }} >Adı : {firstName}</Chip>}
          />

          <List.Item
            title={""}
            titleStyle={{ fontWeight: 'bold' }}
            left={() => <Chip icon="numeric-6-circle" style={{ backgroundColor: "#ECB1B1", width: '50%' }} >Soyadı : {lastName}</Chip>}
          />
        </List.Section>
      </Card.Content>
    </Card>
  );

  return (
    <View>{messageDto.header === "İşe Gelmeyenlerin Listesi" ? <ListofAbsentees /> : <NotficationDefaultComponent />}</View>
  )
}
