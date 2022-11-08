import { VStack , Icon, useToast, FlatList} from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import {Octicons} from '@expo/vector-icons'
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { api } from "../services/api";
import { useCallback, useEffect, useState } from "react";
import { PoolCard, PoolCardProps } from "../components/PoolCard";
import { EmptyPoolList } from "../components/EmptyPoolList";

import { Loading } from "../components/Loading";

export function Pools() {
    const [isLoading, setIsLoading] = useState(true)
    const [pools, setPools] = useState<PoolCardProps[]>([])

    const {navigate} = useNavigation()
    const toast = useToast()

    async function fetchPools() {
        try {
            setIsLoading(true);

            const response = await api.get('/pools')
            setPools(response.data.pools)
        } catch (error) {
            console.log(error)
            toast.show({
                title: 'Não foi possível carregar os bolões: ' + error,
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        fetchPools()
    }, []))

    return (
        <VStack flex={1} bgColor='gray.900'>
            <Header title='Meus bolões'></Header>
            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor='gray.600' pb={4} mb={4}>
                <Button title='BUSCAR BOLÃO POR CÓDIGO'
                    leftIcon={<Icon as={Octicons} name='search' color='black' size='md'></Icon>}
                    onPress={() => navigate('find')}
                ></Button>
            </VStack>
            {isLoading ? 
            
                <Loading></Loading> : 
                
                <FlatList
                    data={pools}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                        <PoolCard 
                            data={item}
                            onPress={() => navigate('details', {id: item.id})}
                        ></PoolCard>
                    )}
                    px={5}
                    mb={20}
                    showsVerticalScrollIndicator
                    _contentContainerStyle={{pb: 10}}
                    ListEmptyComponent={() => <EmptyPoolList/>}
                ></FlatList>
            }
        </VStack>
    )
}