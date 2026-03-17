package com.cly.userservice.config;

import com.baomidou.mybatisplus.core.MybatisConfiguration;
import com.baomidou.mybatisplus.extension.spring.MybatisSqlSessionFactoryBean;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import javax.sql.DataSource;

/**
 * MyBatis-Plus 手动装配（兜底方案）。
 *
 * 当前工程同时存在 MyBatis/MyBatis-Plus 依赖与 Spring Boot 4 环境时，自动装配可能出现
 * SqlSessionFactory 未创建或 BaseMapper CRUD 未注入的问题。这里显式创建
 * SqlSessionFactory/SqlSessionTemplate，确保 BaseMapper 的 selectList/insert 等方法可用。
 */
@Configuration
public class MybatisPlusConfig {

    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        MybatisSqlSessionFactoryBean factoryBean = new MybatisSqlSessionFactoryBean();
        factoryBean.setDataSource(dataSource);
        factoryBean.setTypeAliasesPackage("com.cly.doctorservice.entity");
        // 加载 XML Mapper（classpath*:mapper/*.xml）
        factoryBean.setMapperLocations(
                new PathMatchingResourcePatternResolver().getResources("classpath*:mapper/*.xml")
        );

        MybatisConfiguration configuration = new MybatisConfiguration();
        // 下划线转驼峰：dept_id -> deptId
        configuration.setMapUnderscoreToCamelCase(true);
        factoryBean.setConfiguration(configuration);

        return factoryBean.getObject();
    }

    @Bean
    public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}
