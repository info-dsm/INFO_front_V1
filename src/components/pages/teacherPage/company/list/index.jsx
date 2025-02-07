/* eslint-disable react/jsx-no-undef */
import styled from "styled-components";
import { Notice } from "../../../../common/notice";
import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getCompany,
  getCompanyInfo,
  getCompanyRequest,
} from "../../../../api/teacher";
import LoadingPage from "../../../../common/loading";
import ErrorPage from "../../../../common/error";
import Header from "../../../../common/header";
import { StyledLink } from "../../../../../style/theme";
import NavProps from "../../../../common/nav";
import { TeacherData } from "../../../../../export/data";
import { useNavigate } from "react-router-dom";
const ShowCompany = () => {
  const [count, setCount] = useState(0);
  const [arr, setArr] = useState([]);
  const queryClient = useQueryClient();
  const { status, data } = getCompany(count);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (data?.totalPages > 5) {
      if (data.totalPages % 5 !== 0) {
        if (parseInt(count / 5) === parseInt(data.totalPages / 5)) {
          const asd = parseInt(data.totalPages % 5);
          let aq = new Array(asd).fill(0);
          for (let i = 0; i < asd; i++) {
            aq[i] = 5 * (asd + 1) + 1 + i;
          }
          setArr(aq);
        }
      }
      if (count % 5 === 0 && count / 5 < data.totalPages / 5 - 1) {
        setArr([count + 1, count + 2, count + 3, count + 4, count + 5]);
      } else if (count % 5 === 4) {
        setArr([count - 3, count - 2, count - 1, count, count + 1]);
      }
    } else if (data?.totalPages) {
      console.log(data.totalPages);
      let ad = new Array(data?.totalPages).fill(0);
      for (let i = 0; i < data.totalPages; i++) {
        ad[i] = i + 1;
      }
      setArr(ad);
    }
    window.scrollTo(0, 300);
  }, [count, data]);
  useEffect(() => {
    if (data?.last && data.totalPages - 1 > count) {
      queryClient.prefetchQuery(["list", count + 1], () =>
        getCompanyRequest(count + 1)
      );
    }
  }, [data, count, queryClient]);
  const Click = useCallback((e) => {
    setCount(e);
  }, []);
  const PreFetching = async (id) => {
    queryClient.prefetchQuery(["companyInfo", id], () => getCompanyInfo(id));
  };
  return (
    <>
      {status === "loading" ? (
        <LoadingPage />
      ) : status === "error" ? (
        <ErrorPage />
      ) : (
        <>
          <Header
            title={"기업관리"}
            description={"손쉽게 기업들을 관리해보세요."}
          />
          <NavProps props={TeacherData} idx={0} />
          <SearchDiv>
            <Search
              placeholder="회사이름"
              onInput={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate(`/teacher/${input}`);
              }}
            />
            <StyledLink to={`/teacher/${input}`}>
              <SearchButton>검색</SearchButton>
            </StyledLink>
          </SearchDiv>
          <Table>
            <Ulbox>
              {data.content.map((user, i) => (
                <Libox onMouseDown={() => PreFetching(user.companyNumber)}>
                  <Box>
                    <Title>{count * 8 + (i + 1)}</Title>
                    <ImgDiv>
                      <Img
                        src={
                          user.companyIntroductionResponse.companyLogo?.fileUrl
                        }
                        alt="noneimage"
                        style={{ width: "50px", height: "50px" }}
                      />
                    </ImgDiv>
                    <Category2>
                      <div>{user.companyName}</div>
                    </Category2>
                    <Category>
                      <div>email</div>
                      <div>{user.contactorEmail}</div>
                    </Category>
                    <StyledLink to={`/teacher/company/${user.companyNumber}`}>
                      <ButtonProps>자세히보기</ButtonProps>
                    </StyledLink>
                  </Box>
                </Libox>
              ))}
            </Ulbox>
            <Ul top={100 * (8 - data.content.length) + 50}>
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
                      data.totalPages % 5 === 0
                        ? data.totalPages / 5 + 1 !== parseInt(count / 5) + 1
                        : parseInt(data.totalPages / 5) + 1 !==
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
                <Button onClick={() => setCount(data.totalPages - 1)}>
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
export default ShowCompany;
const Search = styled.input`
  width: 870px;
  top: 0px;
  height: 50px;
  border: none;
  border-radius: 100px;
  padding-left: 15px;
  font: 400 normal 20px "NanumGothic", sans-serif;
`;
const ImgDiv = styled.div`
  display: inline-flex;
  width: 60px;
  height: 60px;
  margin-right: 40px;
`;
const Img = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
`;
const SearchDiv = styled.div`
  position: relative;
  top: 100px;
  width: 1003px;
  height: 60px;
  border: 5px solid ${(props) => props.theme.colors.blue};
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 100px;
`;
const SearchButton = styled.div`
  position: relative;
  top: -55px;
  left: 870px;
  width: 125px;
  height: 60px;
  text-align: center;
  padding-top: 14px;
  font: 700 normal 20px "NanumGothic", sans-serif;
  background-color: ${(props) => props.theme.colors.blue};
  color: ${(props) => props.theme.colors.white};
  border-radius: 100px;
`;
const Table = styled.div`
  margin: 120px auto;
  width: 1190px;
  height: 913px;
  border-radius: 20px;
`;
const Li = styled.li`
  margin-left: -40px;
`;
const Text = styled.div`
  position: relative;
  font: 700 normal 23px "Roboto";
  color: ${(props) => props.theme.colors.black};
  width: 60px;
  height: 60px;
  padding-top: 15px;
  text-align: center;
  background-color: ${(props) =>
    props.state ? props.theme.colors.blue : props.theme.colors.white};
  cursor: pointer;
  border-radius: 100%;
  :hover {
    background-color: ${(props) => props.theme.colors.blue};
    border-radius: 100%;
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
  padding: 0px 20px 0px 45px;
  background-color: ${(props) => props.theme.colors.mediumGray};
  border-radius: 20px;
  display: flex;
  align-items: center;
  vertical-align: center;
`;
const Title = styled.div`
  width: 50px;
  font: 700 normal 24px "NanumGothic", sans-serif;
  color: ${(props) => props.theme.colors.blue};
  display: inline-flex;
  margin-right: 45px;
`;
const Category = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 20px;
  margin-right: 50px;
  div {
    width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font: 700 normal 24px "NanumGothic", sans-serif;
    color: ${(props) => props.theme.colors.blue};
    + div {
      overflow: visible;
      font: 400 normal 20px "NanumGothic", sans-serif;
      color: ${(props) => props.theme.colors.black};
    }
  }
`;
const Category2 = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 20px;
  margin-right: 50px;
  div {
    width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font: 700 normal 24px "NanumGothic", sans-serif;
    color: ${(props) => props.theme.colors.blue};
  }
`;
const ButtonProps = styled.div`
  position: relative;
  border-radius: 100px;
  left: 200px;
  text-align: center;
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.blue};
  width: 120px;
  height: 40px;
  font: 700 normal 14px "NanumGothic", sans-serif;
  padding-top: 10px;
  color: ${(props) => props.theme.colors.white};
`;
