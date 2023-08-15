import {
  Box,
  Divider,
  HStack,
  Heading,
  Image,
  SimpleGrid,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { UserContext } from "../components/ContextUser";
import { useNavigate, useParams } from "react-router-dom";
import LoadingTicket from "../components/LoadingTicket";

interface dataOrder {
  _id: string;
  price: string;
  seat: string;
  image: string;
  category: string;
}
interface dataTicket {
  _id: string;
  price: string;
  seat: string;
  image: string;
  category: string;
  isSold: boolean;
}
function PageUser() {
  const navigate = useNavigate();
  const toast = useToast();
  const { userInfo } = UserContext();
  const { id } = useParams();
  const [order, setOrder] = useState<dataOrder[]>([
    { _id: "", price: "", seat: "", image: "", category: "" },
  ]);

  const [ticket, setTicket] = useState<dataTicket[]>([
    { _id: "", price: "", seat: "", image: "", category: "", isSold: false },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3336/order/${id}`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setLoading(false);
        setOrder(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [id]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3336/ticket/user/${id}`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setLoading(false);
        setTicket(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        toast({
          colorScheme: "pink",
          position: "top",
          title: "يجب عليك اعادة تسجيل الدخول ",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate("/login");
      });
  }, [id]);

  return (
    <Box
      backgroundColor={"#12132c"}
      color={"currentColor"}
      minH={"90.2vh"}
      p={"10px"}
    >
      <Heading textAlign={"right"} pr={"10px"} color={"white"} pt={"4px"}>
        {userInfo.username} أهلا بك{" "}
      </Heading>
      {order.length === 0 ? (
        <Text color={"white"} textAlign={"center"} fontSize={"2xl"}>
          لم تشتري اي تذكرة بعد
        </Text>
      ) : (
        <Text color={"white"} textAlign={"center"} fontSize={"2xl"}>
          التذاكر التي تم شراؤها
        </Text>
      )}

      {loading ? (
        <LoadingTicket />
      ) : (
        order.map((e: any) => {
          return (
            <SimpleGrid
              columns={{ sm: 4, md: 2 }}
              key={e._id}
              borderRadius={"3xl"}
              padding={"10px"}
              minChildWidth={"150px"}
              bg={"whiteAlpha.300"}
              m={"10px"}
              dir="rtl"
            >
              <VStack
                h={"130px"}
                color={"white"}
                justifyContent={"space-evenly"}
              >
                <Text color={"blue.400"} fontSize={"2xl"}>
                  صورة التذكرة
                </Text>
                <Image
                  w={"80px"}
                  h={"80px"}
                  src={`http://localhost:3336/${e.image}`}
                />
              </VStack>
              <VStack
                justifyContent={"space-around"}
                h={"130px"}
                color={"white"}
                textAlign={"center"}
              >
                <Text color={"blue.400"} fontSize={"2xl"}>
                  الفئة
                </Text>
                <Text>{e.category}</Text>
              </VStack>
              <VStack
                justifyContent={"space-around"}
                h={"130px"}
                color={"white"}
                textAlign={"center"}
              >
                <Text color={"blue.400"} fontSize={"2xl"}>
                  المقعد
                </Text>
                <Text>{e.seat}</Text>
              </VStack>
              <VStack
                justifyContent={"space-around"}
                h={"130px"}
                color={"white"}
                textAlign={"center"}
              >
                <Text color={"blue.400"} fontSize={"2xl"}>
                  السعر
                </Text>
                <Text>{e.price}</Text>
              </VStack>
            </SimpleGrid>
          );
        })
      )}
      <Divider />
      {ticket.length === 0 ? (
        <Text color={"white"} textAlign={"center"} fontSize={"2xl"}>
          ليس لديك تذاكر تم عرضها للبيع
        </Text>
      ) : (
        <Text color={"white"} textAlign={"center"} fontSize={"2xl"}>
          التذاكر التي تم عرضها للبيع
        </Text>
      )}

      {loading ? (
        <LoadingTicket />
      ) : (
        ticket.map((e: any) => {
          return (
            <SimpleGrid
              dir="rtl"
              columns={5}
              key={e._id}
              borderRadius={"3xl"}
              padding={"10px"}
              minChildWidth={"150px"}
              bg={"whiteAlpha.300"}
              m={"10px"}
              // ml={"10px"}
            >
              <VStack
                h={"130px"}
                color={"white"}
                justifyContent={"space-evenly"}
              >
                <Text color={"blue.400"} fontSize={"2xl"}>
                  صورة التذكرة
                </Text>
                <Image
                  w={"80px"}
                  h={"80px"}
                  src={`http://localhost:3336/${e.image}`}
                />
              </VStack>
              <VStack
                justifyContent={"space-around"}
                h={"130px"}
                color={"white"}
                textAlign={"center"}
              >
                <Text color={"blue.400"} fontSize={"2xl"}>
                  الفئة
                </Text>
                <Text>{e.category}</Text>
              </VStack>
              <VStack
                justifyContent={"space-around"}
                h={"130px"}
                color={"white"}
                textAlign={"center"}
              >
                <Text color={"blue.400"} fontSize={"2xl"}>
                  المقعد
                </Text>
                <Text>{e.seat}</Text>
              </VStack>
              <VStack
                justifyContent={"space-around"}
                h={"130px"}
                color={"white"}
                textAlign={"center"}
              >
                <Text color={"blue.400"} fontSize={"2xl"}>
                  السعر
                </Text>
                <Text>{e.price}</Text>
              </VStack>
              <VStack
                justifyContent={"space-around"}
                h={"130px"}
                color={"white"}
                textAlign={"center"}
              >
                <Text color={"blue.400"} fontSize={"2xl"}>
                  حالة التذكرة
                </Text>
                {e.isSold ? (
                  <Text>تم بيع التذكرة</Text>
                ) : (
                  <Text>لم يتم بيع التذكرة</Text>
                )}
              </VStack>
            </SimpleGrid>
          );
        })
      )}
    </Box>
  );
}

export default PageUser;

{
  /* <Box
            w={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <VStack
              key={e.id}
              border={"1px solid white"}
              w={"90%"}
              mt={"10px"}
              mb={"10px"}
            >
              <HStack justifyContent={"space-around"} w={"100%"}>
                <Text color={"white"}>الصورة</Text>
                <Text color={"white"}>الفئة</Text>
                <Text color={"white"}>المقعد</Text>
                <Text color={"white"}>السعر</Text>
              </HStack>
              <Divider />
              <HStack
                justifyContent={"space-around"}
                w={"100%"}
                textAlign={"center"}
                pr={"30px"}
              >
                <Image w={"80px"} src={`http://localhost:3336/${e.image}`} />
                <Text color={"white"} textAlign={"center"}>
                  {e.category}
                </Text>
                <Text pr={"30px"} color={"white"}>
                  {e.seat}
                </Text>
                <Text color={"white"}>{e.price}</Text>
              </HStack>
            </VStack>
          </Box> */
}
