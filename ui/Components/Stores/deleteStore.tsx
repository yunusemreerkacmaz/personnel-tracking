import React, { useEffect, useState } from 'react'
import { Alert, FlatList, View } from 'react-native'
import { Button, Card, Checkbox, IconButton, List, Searchbar, Tooltip } from 'react-native-paper'
import { initialStoreLocationDto, StoreDto } from './Dtos/storeDto';
import { DeleteStores, GetStores } from './Requests/storeRequest';
import { ResponseStatus } from '../../ServiceResults/serviceResult';
import Toast from 'react-native-toast-message';
import { initialTimeDto } from '../../Helpers/DataGrid/CrudTimeDto';
import { ToastShowParamsCustomType } from '../../Helpers/Toast/ToastDto';

export default function DeleteStoreComponent() {
    const [search, setSearch] = React.useState('');
    const [stores, setStores] = useState<StoreDto[]>([])
    const [searchStores, setSearchStores] = useState<StoreDto[]>([])
    const [checkeds, setCheckeds] = useState<StoreDto[]>([])
    const [crudStatus, setCrudStatus] = useState<"update" | "delete" | "default">("default")

    useEffect(() => {
        let getStoreAsync = async () => {
            const response = await GetStores();
            if (response?.responseStatus === ResponseStatus.IsSuccess) {
                setStores(response?.results)
                setSearchStores(response?.results)
            }
        }
        getStoreAsync()
    }, [crudStatus])

    const handleDelete = async () => {
        Toast.show({
            text1: "Silme İşlemi Onaylama Ekranı",
            text2: "Personeli silmek istediğinizden emin misiniz ?",
            text1Style: { backgroundColor: 'yellow' },
            type: 'customToast',
            autoHide: false,  // ekranda duruyor
            props: {
                okButtonText: "Onayla",
                cancelButtonText: "İptal",
                onCancelPress: () => {
                    Toast.hide()
                    Toast.show({ text1: "Silme işlemi iptal edildi", type: 'error' })
                },
                onOkPress: async () => {
                    const response = await DeleteStores(checkeds)
                    if (response?.responseStatus === ResponseStatus.IsSuccess) {
                        Toast.show({ text1: response?.responseMessage, type: 'success' })
                        setCrudStatus("delete")
                    }
                    else {
                        Toast.show({ text1: response?.responseMessage, type: 'error' })
                    }
                },
            }
        } as ToastShowParamsCustomType)
    }

    const handleSearch = () => {
        let filterStores = stores.filter(store => store.storeName.toLowerCase().trim().includes(search.toLowerCase().trim()))
        setSearchStores(filterStores)
    }
    const handleSearchClear = () => {
        setSearchStores(stores)
    }

    type ItemProps = { store: StoreDto, index: number };
    const Item: React.FC<ItemProps> = ({ store, index }) => (
        <List.Item
            title={store.storeName}
            key={store.id}
            titleStyle={{ justifyContent: 'center', alignItems: 'center', color: 'black' }}
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
                </View>
            }
        />
    );
    return (

        <Card style={{ flex: 1, backgroundColor: '#E7C5BC', elevation: 24, margin: 10, marginTop: 0 }}>
            <Card.Title subtitleStyle={{ color: 'gray' }} titleStyle={{ fontWeight: 'bold', color: 'black' }} title="KURUM SİLME ALANI" subtitle="Silinmesini istediğiniz kurumu seçin" />
            {stores.length > 0 &&
                <FlatList
                    data={searchStores}
                    style={{ paddingVertical: 2, backgroundColor: '#C5D6E9', padding: 10 }}
                    renderItem={({ item, index }) => <Item store={item} index={index} />}
                    keyExtractor={item => item.id.toString()}
                    ListHeaderComponent={
                        <Searchbar
                            placeholder="Kurum adı ara . . ."
                            onChangeText={setSearch}
                            value={search}
                            style={{ marginVertical: 20 }}
                            onIconPress={handleSearch}
                            onClearIconPress={handleSearchClear}
                        />
                    }

                />}
            <Card.Actions style={{ backgroundColor: '#E0E2E4' }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Button textColor='black' style={checkeds.length > 0 ? { backgroundColor: '#F35454', } : { backgroundColor: "#BDBDBD" }} onPress={handleDelete} disabled={checkeds.length === 0}>Seçilen Mağazaları Sil</Button>
                </View>
            </Card.Actions>
        </Card>
    )
}
