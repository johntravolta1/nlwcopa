import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { PaintBrush } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { Share } from "react-native";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Guesses } from "../components/Guesses";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Option } from "../components/Option";
import { PoolCardProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { api } from "../services/api";

interface RouteParams {
    id: string;
}

export function Details() {
    const [optionSelected, setOptionSelected] = useState<'guesses'| 'ranking'>('guesses')
    const [isLoading, setIsLoading] = useState(false);
    const [pooldDetails, setPoolDetails] = useState<PoolCardProps>({} as PoolCardProps)

    const route = useRoute()
    const {id} = route.params as RouteParams;
    const toast = useToast()

    async function fetchPoolDetails() {
        try {
            setIsLoading(true)

            const response = await api.get(`/pools/${id}`)
            setPoolDetails(response.data.pool)

        } catch (error) {
            console.log(error)
            toast.show({
                title: 'Não foi possível carrega os detalhes do bolão: ' + error,
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false)
        }
    }
    async function handleShareCode() {
        await Share.share({
            message: pooldDetails.code
        })
    }
    useEffect(() => {
        fetchPoolDetails()
    }, [id])

    if(isLoading) {
        return <Loading></Loading>
    }

    return (
        <VStack flex={1} bgColor='gray.900'>
            <Header title={pooldDetails.title} showBackButton showShareButton onShare={handleShareCode}></Header>

            {
                pooldDetails._count?.participants > 0 ?
                
                <VStack px={5} flex={1}>
                    <PoolHeader data={pooldDetails}></PoolHeader>
                    <HStack bgColor='gray.800' p={1} rounded='sm' mb={5}>
                        <Option title='Seus palpites' isSelected={optionSelected === 'guesses'} onPress={() => setOptionSelected('guesses')}></Option>
                        <Option title='Ranking do grupo' isSelected={optionSelected === 'ranking'} onPress={() => setOptionSelected('ranking')}></Option>
                    </HStack>

                    <Guesses poolId={pooldDetails.id}></Guesses>
                </VStack>

                :

                <EmptyMyPoolList code={pooldDetails.code} onShare={handleShareCode}></EmptyMyPoolList>
            }

        </VStack>
    )
}