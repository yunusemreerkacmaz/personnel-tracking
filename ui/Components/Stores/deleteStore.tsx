import React, { useEffect, useState } from 'react'
import { Alert, FlatList, View } from 'react-native'
import { Button, Card, Checkbox, IconButton, List, Searchbar, Text, Tooltip } from 'react-native-paper'
import { initialFilterDto, initialStoreLocationDto, StoreDto, StoreFilterDto } from './Dtos/storeDto';
import { DeleteStores, GetStores } from './Requests/storeRequest';
import { ResponseStatus } from '../../ServiceResults/serviceResult';
import Toast from 'react-native-toast-message';
import { initialTimeDto } from '../../Helpers/DataGrid/CrudTimeDto';

export default function DeleteStore() {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [stores, setStores] = useState<StoreDto[]>([])
    const [checkeds, setCheckeds] = useState<StoreDto[]>([])
    const [filter, setfilter] = useState<StoreFilterDto>(initialFilterDto)
    const [crudStatus, setCrudStatus] = useState<"update" | "delete" | "default">("default")
    
    useEffect(() => {
        let getStoreAsync = async () => {
            const response = await GetStores(filter);
            if (response?.responseStatus === ResponseStatus.IsSuccess) {
                setStores(response?.results)
            }
        }
        getStoreAsync()
    }, [filter.searchValue, crudStatus])


    const handleDelete = async () => {
        Alert.alert("Silme İşlemi Onaylama Ekranı", "Personeli silmek istediğinizden emin misiniz ?",
            [
                {
                    text: "Sil",
                    isPreferred: true,
                    onPress: async () => {
                        const response = await DeleteStores(checkeds)
                        if (response?.responseStatus === ResponseStatus.IsSuccess) {
                            Toast.show({ text1: response?.responseMessage, type: 'success' })
                            setCrudStatus("delete")
                        }
                        else {
                            Toast.show({ text1: response?.responseMessage, type: 'error' })
                        }
                    },
                },
                {
                    text: "İptal",
                }
            ],
            { userInterfaceStyle: 'dark', }
        )
    }

    const handleFilter = () => {
        setfilter(prev => ({ ...prev, searchValue: searchQuery }))
    }

    type ItemProps = { store: StoreDto, index: number };
    const Item: React.FC<ItemProps> = ({ store, index }) => (
        <List.Item
            title={store.storeName}
            key={store.id}
            titleStyle={{ justifyContent: 'center', alignItems: 'center',color:'black' }}
            style={{ paddingVertical: 0, paddingRight: 0, justifyContent: 'center', alignItems: 'center' }} // Yüksekliği azaltmak için
            right={() => (
                <Tooltip
                    titleMaxFontSizeMultiplier={5}
                    enterTouchDelay={10}
                    leaveTouchDelay={2000}
                    title={store.isActive ?
                        "Mağaza aktif olarak kullanıldığından silemezsiniz" :
                        "Mağaza kullanılmadığından silinebilir"}
                >
                    <IconButton
                        icon="information-outline"
                        selected
                        iconColor={store.isActive ? 'red' : 'green'}
                        style={{ margin: 0, padding: 0 }}
                        size={24}
                        onPress={() => {
                        }} />
                </Tooltip>
            )}
            left={() =>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <Checkbox
                        status={checkeds.find(x => x.id == store.id)?.isActive ? 'checked' : 'unchecked'}
                        color={store.isActive ? 'red' : 'green'}
                        uncheckedColor='green'
                        disabled={store.isActive ?? false}
                        onPress={() => {
                            let chedkedStatus = checkeds.some(x => x.id == store.id)
                            if (!chedkedStatus) {
                                setCheckeds([...checkeds, {
                                    id: store.id, isActive: true, storeLocation: initialStoreLocationDto, storeName: "",
                                    storeTime: initialTimeDto,
                                    radius: 0
                                }])
                            }
                            else {
                                const filteredChecked = checkeds.filter(x => x.id != store.id)
                                setCheckeds(filteredChecked)
                            }
                        }}
                    />
                    {/* <Text variant='titleMedium' style={{ fontWeight: 'bold' }}>{index + 1 + ")"}</Text> */}

                </View>
            }
        />
    );
    return (
        <View style={{ width: '95%' }}>
            <Searchbar
                placeholder="Kurum adı ara . . ."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={{ marginVertical: 20 }}
                onIconPress={handleFilter}
            />
            <Card style={{ backgroundColor: '#E7C5BC', maxHeight: '78%', elevation: 24 }}>
                <Card.Title subtitleStyle={{ color:'gray'  }} titleStyle={{ fontWeight: 'bold',color:'black'  }} title="KURUM SİLME ALANI" subtitle="Silinmesini istediğiniz kurumu seçin" />
                <Card.Content style={{ height: '80.5%', backgroundColor: '#C5D6E9' }}>
                    {stores.length > 0 &&
                        <FlatList
                            data={stores}
                            style={{ paddingVertical: 0, paddingRight: 0 }}
                            renderItem={({ item, index }) => <Item store={item} index={index} />}
                            keyExtractor={item => item.id.toString()}

                        />}
                </Card.Content>
                <Card.Actions style={{ backgroundColor: '#E0E2E4', height: '15%' }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Button textColor='black' style={checkeds.length > 0 ? { backgroundColor: '#F35454', } : { backgroundColor: "#BDBDBD" }} onPress={handleDelete} disabled={checkeds.length === 0}>Seçilen Mağazaları Sil</Button>
                    </View>
                </Card.Actions>
            </Card>
        </View>
    )
}
