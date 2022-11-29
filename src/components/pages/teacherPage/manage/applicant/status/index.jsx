import { useParams } from "react-router-dom";
import { getUserCompany, getUseUserCompany } from "../../../../../api/teacher";
import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import LoadingPage from "../../../../../common/loading";
import ErrorPage from "../../../../../common/error";
const StatusManageComponent = () => {
  const { teacherId } = useParams();
  const [count, setCount] = useState(0);
  const { status, data } = useQuery(["teacherGetUser", teacherId, count], () =>
    getUserCompany(teacherId, count)
  );
  const [arr, setArr] = useState([]);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (data?.totalPage > 5) {
      if (data.totalPage % 5 !== 0) {
        if (parseInt(count / 5) === parseInt(data.totalPage / 5)) {
          const asd = parseInt(data.totalPage % 5);
          let aq = new Array(asd).fill(0);
          for (let i = 0; i < 5; i++) {
            if (i < asd) {
              aq[i] = 5 * (asd + 1) + 1 + i;
            } else {
              break;
            }
          }
          setArr(aq);
        }
      }
      if (count % 5 === 0 && count / 5 < data.totalPage / 5 - 1) {
        setArr([count + 1, count + 2, count + 3, count + 4, count + 5]);
      } else if (count % 5 === 4) {
        setArr([count - 3, count - 2, count - 1, count, count + 1]);
      }
    } else if (data?.totalPage) {
      let ad = new Array(data?.totalPage).fill(0);
      for (let i = 0; i < data.totalPage; i++) {
        ad[i] = i + 1;
      }
      setArr(ad);
    }
  }, [count, data?.totalPage]);
  useEffect(() => {
    if (data?.last && data.totalPage - 1 > count) {
      queryClient.prefetchQuery(["teacherGetUser", teacherId, count + 1], () =>
        getUserCompany(teacherId, count + 1)
      );
    }
  }, [data, count, queryClient, teacherId]);
  const Click = useCallback((e) => {
    setCount(e);
  }, []);
  return (
    <>
      {status === "loading" ? (
        <LoadingPage />
      ) : status === "error" ? (
        <ErrorPage />
      ) : (
        <>
          <Table>
            <Ulbox>
              {data.map((user, i) => (
                <Libox>
                  <Box>
                    <Category>
                      <div>{user.student.name}</div>
                      <div>{user.student.studentKey}</div>
                      <div>{user.student.emil}</div>
                    </Category>
                    <Category>
                      <div>채용인원</div>
                      <div>{user.total}명</div>
                    </Category>
                    <ButtonProps>
                      <div>자세히 보기</div>
                      <div>지원자 리스트</div>
                    </ButtonProps>
                  </Box>
                </Libox>
              ))}
            </Ulbox>
            <Ul top={100 * 5 + 50}>
              <Li>
                <Button onClick={() => setCount(0)}>First Page</Button>
              </Li>
              <Li>
                <Text
                  onClick={() => {
                    if (count > 4) {
                      setCount((parseInt(count / 5) - 1) * 5 + 4);
                    }
                  }}
                >
                  &lt;
                </Text>
              </Li>
              {arr.map((item) => (
                <Li id={item} onClick={() => Click(item - 1)}>
                  <Text state={item === count + 1}>{item}</Text>
                </Li>
              ))}
              <Li>
                <Text
                  onClick={() => {
                    if (
                      data.totalPage % 5 === 0
                        ? data.totalPage / 5 + 1 !== parseInt(count / 5) + 1
                        : parseInt(data.totalPage / 5) + 1 !==
                          parseInt(count / 5) + 1
                    ) {
                      setCount((parseInt(count / 5) + 1) * 5);
                    }
                  }}
                >
                  &gt;
                </Text>
              </Li>
              <Li>
                <Button onClick={() => setCount(data.totalPage - 1)}>
                  Last Page
                </Button>
              </Li>
            </Ul>
          </Table>
        </>
      )}
    </>
  );
};
export default StatusManageComponent;
const Table = styled.div`
  margin: 0px auto;
  margin-bottom: 200px;
  width: 1190px;
  height: 663px;
  background-color: ${(props) => props.theme.colors.mediumPurple};
  border-radius: 20px;
`;
const Li = styled.li`
  margin-left: -40px;
`;
const Text = styled.div`
  position: relative;
  font: 700 normal 23px "Roboto";
  color: ${(props) =>
    props.state ? props.theme.colors.white : props.theme.colors.black};
  width: 60px;
  height: 60px;
  padding-top: 15px;
  text-align: center;
  background-color: ${(props) =>
    props.state ? props.theme.colors.blue : props.theme.colors.mediumPurple};
  cursor: pointer;
  border-radius: 100%;
  :hover {
    background-color: ${(props) => props.theme.colors.blue};
    border-radius: 100%;
    color: ${(props) => props.theme.colors.white};
  }
`;
const Button = styled.div`
  width: 160px;
  height: 60px;
  border-radius: 100px;
  background-color: ${(props) => props.theme.colors.blue};
  color: ${(props) => props.theme.colors.white};
  text-align: center;
  padding-top: 17px;
  cursor: pointer;
`;
const Ul = styled.ul`
  position: relative;
  top: ${(props) => props.top}px;
  width: 836px;
  height: 60px;
  list-style-type: none;
  display: flex;
  margin: 0 auto;
  justify-content: space-between;
`;
const Ulbox = styled.ul`
  position: relative;
  list-style-type: none;
  width: 1136px;
  top: 20px;
  margin: 0 auto;
`;
const Libox = styled.li`
  margin-top: 20px;
  margin-left: -40px;
`;
const Box = styled.div`
  width: 1136px;
  height: 80px;
  padding: 25px 20px 0px 65px;
  background-color: ${(props) => props.theme.colors.mediumGray};
  border-radius: 20px;
`;
const Category = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 20px;
  margin-right: 50px;
  div {
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font: 700 normal 24px "NanumGothic", sans-serif;
    color: ${(props) => props.theme.colors.blue};
    + div {
      width: 130px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font: 400 normal 20px "NanumGothic", sans-serif;
      color: ${(props) => props.theme.colors.black};
    }
  }
`;
const ButtonProps = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  left: 750px;
  top: -35px;
  gap: 54px;
  div {
    border-radius: 100px;
    text-align: center;
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.blue};
    width: 120px;
    height: 40px;
    font: 700 normal 14px "NanumGothic", sans-serif;
    padding-top: 10px;
    color: ${(props) => props.theme.colors.white};
  }
`;
